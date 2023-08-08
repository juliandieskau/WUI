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
                History per
                <select v-model="cpu_aggregation_selection">
                    <option :value="null"></option>
                    <option v-for="agg in aggregations" :key="agg" :value="agg">
                        {{ agg }}
                    </option>
                </select>
            </template>
            <template v-if="cpu_aggregation_selection">
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
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2>Memory:</h2>
                {{ Math.round(props.refs.get('/ects/system/mem/usage').used / 1000 / 1000) }} / {{
                    Math.round(props.refs.get('/ects/system/mem/usage').total / 1000 / 1000) }} MB
            </div>
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
            <template v-if="aggregations">
                History per
                <select v-model="mem_aggregation_selection">
                    <option :value="null"></option>
                    <option v-for="agg in aggregations" :key="agg" :value="agg">
                        {{ agg }}
                    </option>
                </select>
            </template>
            <template v-if="mem_aggregation_selection">
                <div style="height: 100px">
                    <LineChart id="mem-history" :data="memdatahistory" :options="{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { max: 100 },
                        }
                    }"></LineChart>
                </div>
            </template>
        </div>
        <div v-if="props.refs.get('#network_adapters')" class="dataset">
            <div style="display: flex; justify-content: space-between; align-items: center">
                <h2>Network:</h2>
                <div style="font-weight: bolder;">
                    <span style="color: rgb(200, 40, 255)">UPLOAD </span>
                    <span style="color: rgb(100, 200, 255)">DOWNLOAD</span>
                </div>
            </div>
            <template v-if="aggregations">
                History per
                <select v-model="network_aggregation_selection">
                    <option :value="null"></option>
                    <option v-for="agg in aggregations" :key="agg" :value="agg">
                        {{ agg }}
                    </option>
                </select>
                Adapter
                <select v-model="network_adapter_selection">
                    <option :value="null"></option>
                    <option v-for="agg in props.refs.get('#network_adapters')" :key="agg" :value="agg">
                        {{ agg }}
                    </option>
                </select>
            </template>
            <template v-if="network_aggregation_selection && network_adapter_selection">
                <div style="height: 100px">
                    <LineChart id="net-history" :data="netdatahistory" :options="{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { min: 0 },
                        }
                    }"></LineChart>
                </div>
            </template>
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

const cpu_aggregation_selection = ref("");
const mem_aggregation_selection = ref("");
const network_aggregation_selection = ref("");
const network_adapter_selection = ref("");

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
    const agg = (props.refs.get(`/ects/system/averages/${cpu_aggregation_selection.value}/cpu/usage`) as ects_msgs.CpuUsageHistory);
    return {
        labels: Array.from({ length: agg.aggregation.keep_amount }, (_, i) => `${i}`),
        datasets: [{
            label: `CPU last ${cpu_aggregation_selection.value}`,
            data: (props.refs.get(`/ects/system/averages/${cpu_aggregation_selection.value}/cpu/usage`) as ects_msgs.CpuUsageHistory).measurements.map((usage: ects_msgs.CpuUsage) => usage.total_usage * 100),
            backgroundColor: 'rgba(0, 100, 220, 1)',
            borderColor: 'rgba(0, 100, 220, 1)',
        }]
    } as unknown as ChartData<'bar'>;
});
const memdata = computed(() => {
    return {
        labels: [""],
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
const memdatahistory = computed(() => {
    const agg = (props.refs.get(`/ects/system/averages/${mem_aggregation_selection.value}/mem/usage`) as ects_msgs.MemoryUsageHistory);
    return {
        labels: Array.from({ length: agg.aggregation.keep_amount }, (_, i) => `${i}`),
        datasets: [{
            label: `CPU last ${mem_aggregation_selection.value}`,
            data: (props.refs.get(`/ects/system/averages/${mem_aggregation_selection.value}/mem/usage`) as ects_msgs.MemoryUsageHistory).measurements.map((usage: ects_msgs.MemoryUsage) => usage.used / usage.total * 100),
            backgroundColor: 'rgb(220, 100, 0)',
            borderColor: 'rgb(220, 100, 0)',
        }]
    } as unknown as ChartData<'bar'>;
});

const netdatahistory = computed(() => {
    const agg = (props.refs.get(`/ects/system/averages/${network_aggregation_selection.value}/network/${network_adapter_selection.value}/usage`) as ects_msgs.NetworkUsageHistory);
    return {
        labels: Array.from({ length: agg.aggregation.keep_amount }, (_, i) => `${i}`),
        datasets: [{
            label: `DOWN last ${network_aggregation_selection.value}`,
            data: (props.refs.get(`/ects/system/averages/${network_aggregation_selection.value}/network/${network_adapter_selection.value}/usage`) as ects_msgs.NetworkUsageHistory).measurements.map((usage: ects_msgs.NetworkUsage) => usage.down_speed),
            backgroundColor: 'rgb(100, 200, 255)',
            borderColor: 'rgb(100, 200, 255)',
        },
        {
            label: `UP last ${network_aggregation_selection.value}`,
            data: (props.refs.get(`/ects/system/averages/${network_aggregation_selection.value}/network/${network_adapter_selection.value}/usage`) as ects_msgs.NetworkUsageHistory).measurements.map((usage: ects_msgs.NetworkUsage) => usage.up_speed),
            backgroundColor: 'rgb(200, 40, 255)',
            borderColor: 'rgb(200, 40, 255)',
        }]
    } as unknown as ChartData<'bar'>;
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