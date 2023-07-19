<template>
    <div v-if="props.refs.get('/ects/system/cpu/usage')" class="item">
        <Bar :data="data" :options="{ responsive: true, scales: { x: { stacked: true } } }"
            :style="{ color: 'var(--color-text)', position: 'relative', width: '100%' }" />
    </div>
</template>

<script setup lang="ts">
import { ects_msgs } from '@/ECTS/Types/Messages';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, PointElement, ChartData } from 'chart.js';


const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});

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

<style scoped></style>