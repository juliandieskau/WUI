<template>
    <div v-if="props.refs.get('/ects/system/cpu/usage')" class="cpu">
        <span>CPU 0-{{ props.refs.get('/ects/system/cpu/usage').per_core_usage.length - 1 }}:</span>
        <div v-for="(usage, core) in (props.refs.get('/ects/system/cpu/usage') as ects_msgs.CpuUsage).per_core_usage"
            :key="core" class="core">
            <span>{{ (usage * 100).toFixed(0) }}%</span>
        </div>
    </div>
    <template v-if="props.refs.get('/ects/system/mem/usage')">
        <div style="height: 100px;">
            <BarChart id="mem" :data="memdata"
                :options="{ responsive: true, maintainAspectRatio: false, maxBarThickness: 100, indexAxis: 'y', scales: { y: { stacked: true }, x: { stacked: true, max: props.refs.get('/ects/system/mem/usage').total } } }"
                :style="{ color: 'var(--color-text)' }" />
        </div>
    </template>
</template>

<script setup lang="ts">
import { ects_msgs } from '@/ECTS/Types/Messages';
import { computed, ref } from 'vue';
import { ChartData } from 'chart.js';
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';

const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});


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
            label: 'Total',
            data: [props.refs.get('/ects/system/mem/usage').used],
            backgroundColor: 'rgb(220, 100, 0)',
        }, {
            label: 'Free',
            data: [props.refs.get('/ects/system/mem/usage').free],
            backgroundColor: 'rgb(0, 220, 100)',
        },]
    } as ChartData<'bar'>;
});
</script>

<style scoped>
.cpu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.cpu.core {}
</style>