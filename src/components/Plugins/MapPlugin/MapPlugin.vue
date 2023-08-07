<template>
    <div ref="el" id="el">
        <l-map ref="map" v-model:zoom="zoom" v-model:center="center">
            <l-control position="topleft">
                <button @click="centerViewOnRobot()" title="center view">📌</button>
            </l-control>
            <l-control position="topright">
                <select v-model="selectedFilename">
                    <option></option>
                    <option v-for="filename in waypointLists" :key="filename" :value="filename">{{ filename }}
                    </option>
                </select>
                <button v-if="selectedFilename" @click="loadWaypointList(selectedFilename)">Load selected</button>
                <button v-if="selectedFilename" @click="saveWaypointList(selectedFilename)">Save selected</button>
                <button v-if="!selectedFilename" @click="promptWaypointListName()">new list</button>
            </l-control>
            <l-control position="bottomright">
                <button @click="addWaypointMiddle" title="add waypoint">
                    <SolarMapPointAddLinear style="font-size: 2em; color: rgb(0, 147, 233)" />
                </button>
            </l-control>
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap"></l-tile-layer>
            <l-marker v-if="props.refs.get('/ects/control/position')" :lat-lng="position">
                <l-icon style="background-color: transparent; border: 0">
                    <mdi-dog style="color: orange; font-size: 1.5em;" />
                </l-icon>
            </l-marker>
            <template v-if="props.refs.get('/ects/waypoints/waypoint_list')">
                <l-polyline color="green" v-if="props.refs.get('/ects/control/position')" :lat-lngs="[...((props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList)).waypoints.map((waypoint) => [waypoint.pose.x, waypoint.pose.y] as PointTuple),
                [position[0], position[1]]]" />
                <l-marker
                    v-for="(waypoint, index) in ((props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList)).waypoints"
                    :key="index" :lat-lng="[waypoint.pose.x, waypoint.pose.y]" draggable
                    @dragend="event => moveWaypoint(event, index)">
                    <l-tooltip>
                        <h2>{{ waypoint.name }} ({{ index }})</h2> <br />
                        radius: {{ waypoint.radius.toFixed(2) }}<br />
                        wait time: {{ waypoint.wait_time.toFixed(2) }}<br />
                        use heading: {{ waypoint.use_heading }}<br />
                        heading accuracy: {{ waypoint.heading_accuracy.toFixed(2) }}<br />
                    </l-tooltip>
                    <l-popup class="popup">
                        <h1>#{{ index }}:</h1>
                        <form>
                            <div>
                                <label>name</label>
                                <input v-model="waypoint.name" />
                            </div>
                            <div>
                                <label>radius</label>
                                <input v-model="waypoint.radius" type="number" />
                            </div>
                            <div>
                                <label>wait time</label>
                                <input v-model="waypoint.wait_time" type="number" />
                            </div>
                            <div>
                                <label>use-heading</label>
                                <input v-model="waypoint.use_heading" type="checkbox" />
                            </div>
                            <div>
                                <label>heading-accurracy</label>
                                <input v-model="waypoint.heading_accuracy" type="number" />
                            </div>
                            <button type="submit" @click.prevent="() => editWaypoint(index, waypoint)"
                                class="submit">save</button>
                        </form>
                        <button type="button" @click.prevent="() => removeWaypoint(index)" class="delete">
                            <MaterialSymbolsDeleteForever />
                        </button>
                    </l-popup>
                </l-marker>
            </template>
        </l-map>
    </div>
</template>
  
<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControl, LMarker, LIcon, LPolyline, LTooltip, LPopup } from "@vue-leaflet/vue-leaflet";
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import L, { DragEndEvent, LatLng, Point, PointExpression, type PointTuple } from "leaflet";
import "leaflet.utm";

import SolarMapPointAddLinear from '~icons/solar/map-point-add-linear';
import MaterialSymbolsDeleteForever from '~icons/material-symbols/delete-forever';
import MdiDog from '~icons/mdi/dog';

import { ects_msgs, geometry_msgs, nav_msgs } from "@/ECTS/Types/Messages";
import { ECTS } from "@/ECTS/ECTS";
import ROSLIB from "roslib";

const el: Ref<HTMLDivElement | null> = ref(null);

const zoom: Ref<number> = ref(24);
const center: Ref<PointTuple> = ref([49.01550865987086, 8.425810112163253]);

const ects = computed(() => props.refs.get('#ects') as ECTS);
const waypointLists = ref<string[]>([]);
const selectedFilename = ref('');
const waypointList = computed({
    get() {
        const list = props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList;
        return list;
    },
    set(newValue) {
        props.refs.set('/ects/waypoints/waypoint_list', newValue);
    },
});

const loadWaypointListDir = () => {
    ects.value.callService('/ects/waypoints/saved_lists', 'ects/WaypointListDirectory', new ROSLIB.ServiceRequest({})).then((response) => {
        const responseCast = response as ects_msgs.WaypointListDirectory;
        waypointLists.value = responseCast.filenames;
    });
};

loadWaypointListDir();

watch(() => props.refs.get('/ects/waypoints/waypoint_list'), (value, oldValue) => {
    console.log("received list update", value);
});

const props = defineProps({
    refs: { type: Object, required: true, default: () => { } }
});

const position = computed(() => {
    let pos = props.refs.get('/ects/control/position') as nav_msgs.Odometry;
    const latLng = utmToLatLng(pos.pose.pose.position.x, pos.pose.pose.position.y);
    return [latLng.lat, latLng.lng] as PointTuple;
});


const loadWaypointList = (name: string) => {
    return ects.value.callService('/ects/waypoints/load_waypoint_list', 'ects/LoadWaypointList', new ROSLIB.ServiceRequest({
        filename: name
    }));
};

const saveWaypointList = (name: string) => {
    return ects.value.callService('/ects/waypoints/save_waypoint_list', 'ects/SaveWaypointList', new ROSLIB.ServiceRequest({
        filename: name
    }));
};

const promptWaypointListName = () => {
    let name = prompt("Please enter a name for the new waypoint list", "");
    if (!name?.endsWith(".waypoints")) {
        name += ".waypoints";
    }
    if (name) {
        saveWaypointList(name).then(() => {
            loadWaypointListDir();
        });
    }
};

const addWaypointMiddle = () => {
    console.log("add waypoint", waypointList.value.waypoints.length);
    const ects: ECTS = props.refs.get('#ects');
    console.log("add waypoint", center.value);
    ects.sendMessage(new ROSLIB.Topic({ ros: ects.getRos(), name: '/ects/waypoints/add_waypoint', messageType: "ects/AddWaypoint", }), new ROSLIB.Message({
        waypoint: {
            name: "new waypoint",
            pose: {
                x: (center.value as unknown as LatLng).lat,
                y: (center.value as unknown as LatLng).lng,
                theta: 0
            },
            radius: 1
        },
        index: waypointList.value.waypoints.length
    } as ects_msgs.AddWaypoint));
};

const moveWaypoint = (event: DragEndEvent, index: number) => {
    console.log("move waypoint", index);
    const waypoint = waypointList.value.waypoints[index];
    waypoint.pose.x = event.target.getLatLng().lat;
    waypoint.pose.y = event.target.getLatLng().lng;
    const newList = waypointList.value;
    newList.waypoints[index] = waypoint;
    waypointList.value = newList;
    editWaypoint(index, waypoint);
};

const editWaypoint = (index: number, waypoint: ects_msgs.Waypoint) => {
    console.log("send replace waypoint", index, waypoint);
    const ects: ECTS = props.refs.get('#ects');
    ects.sendMessage(new ROSLIB.Topic({ ros: ects.getRos(), name: '/ects/waypoints/replace_waypoint', messageType: "ects/ReplaceWaypoint", }), new ROSLIB.Message({
        index_to_replace: index,
        replacement_waypoint: waypoint
    } as ects_msgs.ReplaceWaypoint));
};

const removeWaypoint = (index: number) => {
    console.log("send remove waypoint", index);
    const ects: ECTS = props.refs.get('#ects');
    ects.sendMessage(new ROSLIB.Topic({ ros: ects.getRos(), name: '/ects/waypoints/remove_waypoint', messageType: "ects/ReplaceWaypoint", }), new ROSLIB.Message({
        index: index,
    } as ects_msgs.RemoveWaypoint));
};

watch(() => props.refs.get('/ects/control/position'), (value, oldValue) => {
    if (value && !oldValue) {
        centerViewOnRobot();
    }
});


/**
 * @description Centers the map on the coordinates and sets the zoom level to 20.
 */
const centerView = (latLng: L.LatLng) => {
    zoom.value = 20;
    center.value = [latLng.lat, latLng.lng];
};

const centerViewOnRobot = () => {
    console.log("center view on robot", position.value);
    if (position.value) {
        centerView({ lat: position.value[0], lng: position.value[1] } as L.LatLng);
    }
};

const utmToLatLng = (x: number, y: number) => {
    return L.utm({ x: x, y: y, zone: 32, band: "U", southHemi: false }).latLng();
};

const observer = new IntersectionObserver(() => {
    if (el.value?.parentElement?.style.display != 'none') {
        window.dispatchEvent(new Event("resize"));
    }
});
onMounted(() => {
    observer.observe(el.value!);
});

onUnmounted(() => {
    observer.disconnect();
});
</script>
  
<style scoped>
#el {
    height: 100%;
    width: 100%;
}

:global(.leaflet-div-icon) {
    background: transparent;
    border: 0;
}

:global(.leaflet-popup-content>.popup) {
    width: 250px;
}

.popup>form {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: stretch;
    justify-items: center;
}

.popup>form>div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.popup>form>div>input {
    width: 50%;
}

.popup>form>div>input[type=checkbox] {
    width: 13px;
}

button.delete {
    color: var(--color-important);
}

button.submit {
    width: 100%;
    color: var(--color-success);
    font-weight: bolder;
}
</style>