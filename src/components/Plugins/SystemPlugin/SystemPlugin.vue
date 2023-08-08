<template>
    <div id="sys-resources">
        <div v-if="props.refs.get('/ects/system/cpu/usage')" class="dataset">
            <h2>CPU:</h2>
            <div style="height: 100px">
                <BarChart id="cpu" :data="cpudata" :options="{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { max: 100 },
                        x: { stacked: true }
                    }
                }"></BarChart>

            </div>
            <template v-if="aggregations">
                History every
                <select v-model="aggregation">
                    <option :value="null"></option>
                    <option v-for="agg in aggregations" :key="agg" :value="agg">
                        {{ agg }}
                    </option>
                </select>
            </template>
            <template v-if="aggregation">
                <div style="height: 100px">
                    <LineChart id="cpu-history" :data="cpudatahistory" :options="{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { max: 100 },
                        }
                    }"></LineChart>
                </div>
            </template>
        </div>
        <div v-if="props.refs.get('/ects/system/mem/usage')" class="dataset">
            <h2>Memory:</h2>
            <div style="height: 60px">
                <BarChart id="mem" :data="memdata" style="color: #fff" :options="{
                    responsive: true,
                    maintainAspectRatio: false,
                    maxBarThickness: 100,
                    indexAxis: 'y',
                    scales: {
                        y: { stacked: true },
                        x: {
                            stacked: true,
                            max: Math.round(props.refs.get('/ects/system/mem/usage').total / 1000 / 1000)
                        }
                    }
                }" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ects_msgs } from '@/ECTS/Types/Messages';
import { computed, ref } from 'vue';
import { ChartData, scales } from 'chart.js';
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';
import { optimizeDeps } from 'vite';

const props = defineProps({
    refs: { type: Map<string, any>, required: true, default: () => { } }
});

const aggregations = computed(() => {
    const list = props.refs.get("#aggregation_list");
    return list;
});

const aggregation = ref("");

const cpudata = computed(() => {
    return {
        labels: (props.refs.get("/ects/system/cpu/usage") as ects_msgs.CpuUsage).per_core_usage.map((_, i) => `${i}`),
        datasets: [{
            label: 'CPU',
            data: props.refs.get("/ects/system/cpu/usage").per_core_usage.map((usage: number) => usage * 100),
            backgroundColor: 'rgba(0, 100, 220, 1)',
        }]
    } as unknown as ChartData<'bar'>;
});
const cpudatahistory = computed(() => {
    const agg = (props.refs.get(`/ects/system/averages/${aggregation.value}/cpu/usage`) as ects_msgs.CpuUsageHistory);
    return {
        labels: Array.from({ length: agg.aggregation.keep_amount }, (_, i) => `${i}`),
        datasets: [{
            label: `CPU last ${aggregation.value}`,
            data: (props.refs.get(`/ects/system/averages/${aggregation.value}/cpu/usage`) as ects_msgs.CpuUsageHistory).measurements.map((usage: ects_msgs.CpuUsage) => usage.total_usage * 100),
            backgroundColor: 'rgba(0, 100, 220, 1)',
            borderColor: 'rgba(0, 100, 220, 1)',
        }]
    } as unknown as ChartData<'bar'>;
});
const memdata = computed(() => {
    return {
        labels: ["GB"],
        datasets: [{
            label: 'Total',
            data: [props.refs.get('/ects/system/mem/usage').used].map((v) => Math.round(v / 1000 / 1000)),
            backgroundColor: 'rgb(220, 100, 0)',
        }, {
            label: 'Free',
            data: [props.refs.get('/ects/system/mem/usage').free].map((v) => Math.round(v / 1000 / 1000)),
            backgroundColor: 'rgb(0, 220, 100)',
        },]
    } as ChartData<'bar'>;
});
</script>

<style scoped>
#sys-resources {
    background-color: var(--color-background-mute);
    width: 100%;
    height: 100%;
}

.cpu {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.dataset {
    outline: 1px solid var(--color-background-soft);
}
</style>