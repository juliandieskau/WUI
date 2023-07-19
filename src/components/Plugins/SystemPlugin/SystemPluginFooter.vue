<template>
    <div v-if="props.refs.get('/ects/system/cpu/usage')">
        <fa6-solid-microchip />
        <span>{{ ((props.refs.get('/ects/system/cpu/usage') as ects_msgs.CpuUsage).total_usage * 100).toFixed(1) }}%</span>
    </div>
</template>

<script setup lang="ts">

import { ects_msgs } from '@/ECTS/Types/Messages';
import Fa6SolidMicrochip from '~icons/fa6-solid/microchip';

const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});

</script>

<style scoped>
span {
    padding-left: 4px;
}
</style>