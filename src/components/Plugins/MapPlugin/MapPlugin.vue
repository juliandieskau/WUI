<template>
    <div ref="el" id="el">
        <l-map ref="map" v-model:zoom="zoom" v-model:center="center">
            <l-control position="topleft">
                <button @click="centerView">📌</button>
            </l-control>
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap"></l-tile-layer>
            <l-marker v-if="props.refs.get('/ects/control/position')" :lat-lng="position">
                <l-icon style="background-color: transparent; border: 0">
                    <mdi-dog style="color: orange; font-size: 1.5em;" />
                </l-icon>
            </l-marker>
            <template v-if="props.refs.get('/ects/waypoints/waypoint_list')">
                <l-polyline color="green"
                    :lat-lngs="[...((props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList)).waypoints.map((waypoint) => [waypoint.pose.x, waypoint.pose.y] as PointTuple),
                    [(props.refs.get('/ects/control/position') as geometry_msgs.Pose2D).x, (props.refs.get('/ects/control/position') as geometry_msgs.Pose2D).y]]" />
                <l-marker
                    v-for="(waypoint, index) in ((props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList)).waypoints"
                    :key="index" :lat-lng="[waypoint.pose.x, waypoint.pose.y]"></l-marker>
            </template>
        </l-map>
    </div>
</template>
  
<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControl, LMarker, LIcon, LPolyline } from "@vue-leaflet/vue-leaflet";
import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";
import { type PointTuple } from "leaflet";

import MdiDog from '~icons/mdi/dog';
import { ects_msgs, geometry_msgs, nav_msgs } from "@/ECTS/Types/Messages";

const el: Ref<HTMLDivElement | null> = ref(null);

const zoom: Ref<number> = ref(24);
const center: Ref<PointTuple> = ref([49.01550865987086, 8.425810112163253]);

const props = defineProps({
    refs: { type: Object, required: true, default: () => { } }
});

const position = computed(() => {
    let pos = props.refs.get('/ects/control/position') as geometry_msgs.Pose2D;
    return [pos.x, pos.y] as PointTuple;
});

/**
 * @description Centers the map on the coordinates and sets the zoom level to 20.
 */
const centerView = () => {
    zoom.value = 20;
    center.value = [49.01550865987086, 8.425810112163253];
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