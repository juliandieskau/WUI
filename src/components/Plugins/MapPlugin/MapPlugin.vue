<template>
    <div ref="el" id="el">
        <l-map ref="map" v-model:zoom="zoom" v-model:center="center">
            <l-control position="topleft">
                <button @click="centerViewOnRobot()" title="center view">📌</button>
                <select @change="() => loadWaypointList(selectedFilename)" v-model="selectedFilename">
                    <option v-for="filename in waypointLists" :key="filename" :value="filename">{{ filename }}
                    </option>
                </select>
            </l-control>
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap"></l-tile-layer>
            <l-marker v-if="props.refs.get('/ects/control/position')" :lat-lng="position">
                <l-icon style="background-color: transparent; border: 0">
                    <mdi-dog style="color: orange; font-size: 1.5em;" />
                </l-icon>
            </l-marker>
            <template v-if="props.refs.get('/ects/waypoints/waypoint_list')">
                <l-polyline color="green" v-if="props.refs.get('/ects/control/position')"
                    :lat-lngs="[...((props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList)).waypoints.map((waypoint) => [waypoint.pose.x, waypoint.pose.y] as PointTuple),
                    [(props.refs.get('/ects/control/position') as geometry_msgs.Pose2D).x, (props.refs.get('/ects/control/position') as geometry_msgs.Pose2D).y]]" />
                <l-marker
                    v-for="(waypoint, index) in ((props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList)).waypoints"
                    :key="index" :lat-lng="[waypoint.pose.x, waypoint.pose.y]" draggable
                    @dragend="event => moveWaypoint(event, index)">
                    <l-tooltip>
                        {{ waypoint.name }} ({{ index }})<br />
                        radius: {{ waypoint.radius }}<br />
                    </l-tooltip>
                </l-marker>
            </template>
        </l-map>
    </div>
</template>
  
<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControl, LMarker, LIcon, LPolyline, LTooltip } from "@vue-leaflet/vue-leaflet";
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { DragEndEvent, type PointTuple } from "leaflet";

import MdiDog from '~icons/mdi/dog';
import { ects_msgs, geometry_msgs } from "@/ECTS/Types/Messages";
import { ECTS } from "@/ECTS/ECTS";
import ROSLIB from "roslib";

const el: Ref<HTMLDivElement | null> = ref(null);

const zoom: Ref<number> = ref(24);
const center: Ref<PointTuple> = ref([49.01550865987086, 8.425810112163253]);

const ects = computed(() => props.refs.get('#ects') as ECTS);
const waypointLists = ref<string[]>([]);
const selectedFilename = ref('');
const waypointList = computed(() => {
    const list = props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList;
    return list;
});

watch(waypointList, (value) => {
    if (value) {
        selectedFilename.value = value.name;
    }
});

ects.value.callService('/ects/waypoints/saved_lists', 'ects/WaypointListDirectory', new ROSLIB.ServiceRequest({})).then((response) => {
    const responseCast = response as ects_msgs.WaypointListDirectory;
    waypointLists.value = responseCast.filenames;
});


const props = defineProps({
    refs: { type: Object, required: true, default: () => { } }
});

const position = computed(() => {
    let pos = props.refs.get('/ects/control/position') as geometry_msgs.Pose2D;
    return [pos.x, pos.y] as PointTuple;
});

const loadWaypointList = (name: string) => {
    ects.value.callService('/ects/waypoints/load_waypoint_list', 'ects/LoadWaypointList', new ROSLIB.ServiceRequest({
        filename: name
    }));
};

const moveWaypoint = (event: DragEndEvent, index: number) => {
    let waypoint = waypointList.value.waypoints[index];
    waypoint.pose.x = event.target.getLatLng().lat;
    waypoint.pose.y = event.target.getLatLng().lng;
    waypointList.value.waypoints[index] = waypoint;
    props.refs.set('/ects/waypoints/waypoint_list', waypointList);
    const ects: ECTS = props.refs.get('#ects');
    console.log(index, waypoint.pose.x, waypoint.pose.y);
    ects.sendMessage(new ROSLIB.Topic({ ros: ects.getRos(), name: '/ects/waypoints/replace_waypoint', messageType: "ects/ReplaceWaypoint", }), new ROSLIB.Message({
        index_to_replace: index,
        replacement_waypoint: waypoint
    } as ects_msgs.ReplaceWaypoint));
};

watch(() => props.refs.get('/ects/control/position'), (value, oldValue) => {
    if (value && !oldValue) {
        centerView(value.x, value.y);
    }
});


/**
 * @description Centers the map on the coordinates and sets the zoom level to 20.
 */
const centerView = (x: number, y: number) => {
    zoom.value = 20;
    center.value = [x, y];
};

const centerViewOnRobot = () => {
    let pos = props.refs.get('/ects/control/position');
    if (pos) {
        centerView(pos.x, pos.y);
    }
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
</style>