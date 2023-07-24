<template>
    <Line :data="(props.data as ChartData<'line'>)" :options="props.options" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { Chart, LinearScale, CategoryScale, PointElement, ChartData, LineElement, Title } from 'chart.js';

const props = defineProps({
    data: { type: Object, required: true, default: () => { } },
    options: { type: Object, default: () => { } },
});

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

</script>

<style scoped></style>