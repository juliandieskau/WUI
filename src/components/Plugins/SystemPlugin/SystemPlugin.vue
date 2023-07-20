<template>
    <div ref="el">
        <template v-if="props.refs.get('/ects/system/cpu/usage')">
            <BarGraph id="cpu" :data="cpudata" :options="{ responsive: true, scales: { x: { stacked: true } } }"
                :style="{ color: 'var(--color-text)' }" />
        </template>
        <template v-if="props.refs.get('/ects/system/mem/usage')">
            <BarGraph id="mem" :data="memdata"
                :options="{ responsive: true, indexAxis: 'y', scales: { y: { stacked: true } } }"
                :style="{ color: 'var(--color-text)' }" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ects_msgs } from '@/ECTS/Types/Messages';
import { computed, ref } from 'vue';
import { ChartData } from 'chart.js';
import BarGraph from './BarGraph.vue';

const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});

const el = ref<HTMLElement | null>(null);
const cpudata = computed(() => {
    return {
        labels: (props.refs.get("/ects/system/cpu/usage") as ects_msgs.CpuUsage).per_core_usage.map((_, i) => `Core ${i}`),
        datasets: [{
            label: 'CPU',
            data: props.refs.get("/ects/system/cpu/usage").per_core_usage,
            backgroundColor: 'rgba(0, 100, 220, 1)',
            barThickness: "flex",
            barPercentage: "0.7",
        }, {
            label: 'CPU avg',
            data: props.refs.get("/ects/system/cpu/usage").load_averages,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }]
    } as ChartData<'bar'>;
});
const memdata = computed(() => {
    return {
        labels: ["Memory"],
        datasets: [{
            label: 'Free',
            data: props.refs.get('/ects/system/mem/usage').free,
            backgroundColor: 'rgb(0, 220, 100)',
        }, {
            label: 'Total',
            data: props.refs.get('/ects/system/mem/usage').total,
            backgroundColor: 'rgb(220, 100, 0)',
        }]
    };
});
</script>

<style scoped></style>