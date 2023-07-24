<template>
    <div>
        <div v-if="props.refs.get('/ects/waypoints/waypoint_list')">
            <CodiconActivateBreakpoints />
            <span>
                {{ (props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList).name }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ects_msgs } from '@/ECTS/Types/Messages';
import CodiconActivateBreakpoints from '~icons/codicon/activate-breakpoints';

const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});

</script>

<style scoped>
span {
    padding-left: 4px;
}
</style>