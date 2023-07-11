<template>
    HELLO WORLD
    <material-symbols-globe-uk style="font-size: 2em;" />
    <template v-for="[topic, message] in props.refs" :key="topic">
        <h1 class="key">{{ topic }}</h1>
        <div v-for="[key, v] in Object.entries(message)" :key="key">
            <span class="key">
                {{ key }}:
            </span>
            <span class="val">
                {{ v }}
            </span>
        </div>
    </template>
</template>

<script setup lang="ts">

import MaterialSymbolsGlobeUk from "~icons/material-symbols/globe-uk";

const props = defineProps({
    refs: { type: Map<string, ROSLIB.Message>, required: false, default: () => { } }
});

</script>

<style scoped></style>