<template>
    <div>
        <div>
            <material-symbols-rotate-90-degrees-cw-outline style="font-size: 2em;" />
            <span>{{ (refs.get("turtle1/pose") as TurtlesimPose)?.theta?.toFixed(2) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">

import MaterialSymbolsRotate90DegreesCwOutline from '~icons/material-symbols/rotate-90-degrees-cw-outline';
import { TurtlesimPose } from './TurtlesimPlugin';
const props = defineProps({
    refs: { type: Map<string, ROSLIB.Message>, required: true }
});

</script>

<style scoped></style>