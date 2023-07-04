<template>
    <div>
        <l-map ref="map" v-model:zoom="zoom" v-model:center="center">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap"></l-tile-layer>
            <l-control position="topleft">
                <button @click="centerView">📌</button>
            </l-control>
        </l-map>
    </div>
</template>
  
<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControl } from "@vue-leaflet/vue-leaflet";
import { ref, type Ref } from "vue";
import { type PointTuple } from "leaflet";

const zoom: Ref<number> = ref(20);
const center: Ref<PointTuple> = ref([49.01550865987086, 8.425810112163253]);

/**
 * @description Centers the map on the coordinates and sets the zoom level to 20.
 */
const centerView = () => {
    zoom.value = 20;
    center.value = [49.01550865987086, 8.425810112163253];
};

</script>
  
<style scoped>
div {
    height: 100%;
    width: 100%;
}
</style>