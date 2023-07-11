<template>
    <div>
        <div>
            <material-symbols-globe-uk style="font-size: 2em;" />
            <span>{{ (refs.get("test1/test") as TestMessage)?.test }}</span>
        </div>
        <div>
            <material-symbols-globe-uk style="font-size: 2em;" />
            <span>Hello World</span>
        </div>
    </div>
</template>

<script setup lang="ts">

type TestMessage = {
    test: string;
}

import MaterialSymbolsGlobeUk from "~icons/material-symbols/globe-uk";

const props = defineProps({
    refs: { type: Map<string, ROSLIB.Message>, required: false, default: () => { } }
});

</script>

<style scoped></style>