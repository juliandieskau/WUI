<template>
    <div>
        <div v-if="props.refs.get('/ects/system/cpu/usage')">
            <fa6-solid-microchip />
            <span>{{ ((props.refs.get('/ects/system/cpu/usage') as ects_msgs.CpuUsage).total_usage * 100).toFixed(1)
            }}%</span>
        </div>
        <div v-if="props.refs.get('/ects/system/mem/usage')">
            <bi-memory />
            <span>{{ ((((props.refs.get('/ects/system/mem/usage') as ects_msgs.MemoryUsage).used /
                (props.refs.get('/ects/system/mem/usage') as ects_msgs.MemoryUsage).total)) * 100).toFixed(0) }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ects_msgs } from '@/ECTS/Types/Messages';
import Fa6SolidMicrochip from '~icons/fa6-solid/microchip';
import BiMemory from '~icons/bi/memory';

const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});

</script>

<style scoped>
span {
    padding-left: 4px;
}</style>