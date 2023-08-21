<template>
  <Bar :data="(props.data as ChartData<'bar'>)" :options="props.options" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ChartData
} from 'chart.js';

const props = defineProps({
  data: { type: Object, required: true, default: () => {} },
  options: { type: Object, default: () => {} }
});

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  PointElement
);
</script>

<style scoped></style>
