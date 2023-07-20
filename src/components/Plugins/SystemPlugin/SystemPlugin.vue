<template>
    <div ref="el">
        <div v-if="props.refs.get('/ects/system/cpu/usage')">
            <Bar :data="data" :key="el?.clientWidth" :options="{ responsive: true, scales: { x: { stacked: true } } }"
                :style="{ color: 'var(--color-text)' }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ects_msgs } from '@/ECTS/Types/Messages';
import { computed, onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, PointElement, ChartData } from 'chart.js';

import MaterialSymbolsWidthRounded from '~icons/material-symbols/width-rounded';

const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});

const el = ref<HTMLElement | null>(null);

Chart.register(BarController, BarElement, LinearScale, CategoryScale, PointElement);
const data = computed(() => {
    return {
        labels: (props.refs.get("/ects/system/cpu/usage") as ects_msgs.CpuUsage).per_core_usage.map((_, i) => `Core ${i}`),
        datasets: [{
            label: 'CPU',
            data: props.refs.get("/ects/system/cpu/usage").per_core_usage,
            backgroundColor: 'rgba(0, 220, 100, 1)',
            barThickness: "flex",
            barPercentage: "0.7"
        }, {
            label: 'CPU avg',
            data: props.refs.get("/ects/system/cpu/usage").load_averages,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }]
    } as ChartData<'bar'>;
});
</script>

<style scoped>
.floating {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0;
    margin: 0;
    overflow: hidden;
    color: var(--color-text);
    background-color: var(--color-background);
    font-size: 1.5em;
    z-index: 1;
    border-radius: 500px;
    aspect-ratio: 1;
}
</style>