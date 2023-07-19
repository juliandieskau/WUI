<template>
    <div>
        <div v-if="usage.power_supply_status == 1">
            <material-symbols-power-plug-outline-rounded style="color: green; font-size: 1.5em" />
        </div>
        <div v-if="usage.percentage" :style="critical ? { color: 'var(--color-important) !important' } : {}">
            <material-symbols-battery20-rounded v-if="usage.percentage > 0.95" />
            <material-symbols-battery6-bar-rounded v-else-if="usage.percentage > 0.8" />
            <material-symbols-battery5-bar-rounded v-else-if="usage.percentage > 0.65" />
            <material-symbols-battery4-bar-rounded v-else-if="usage.percentage > 0.5" />
            <material-symbols-battery3-bar-rounded v-else-if="usage.percentage > 0.35" />
            <material-symbols-battery2-bar-rounded v-else-if="usage.percentage > 0.2" />
            <material-symbols-battery1-bar-rounded v-else-if="usage.percentage > 0.05" />
            <material-symbols-battery0-bar-rounded v-else />
            {{ (usage.percentage * 100).toFixed(1) }}%
            <span v-if="estimated"> ({{ estimated.data }} min) </span>
        </div>
        <div v-else>
            <material-symbols-battery-unknown-rounded />
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { sensor_msgs, std_msgs } from '@/ECTS/Types/Messages';

import MaterialSymbolsBattery20Rounded from '~icons/material-symbols/battery-20-rounded';
import MaterialSymbolsBatteryUnknownRounded from '~icons/material-symbols/battery-unknown-rounded';
import MaterialSymbolsBattery6BarRounded from '~icons/material-symbols/battery-6-bar-rounded';
import MaterialSymbolsBattery5BarRounded from '~icons/material-symbols/battery-5-bar-rounded';
import MaterialSymbolsBattery4BarRounded from '~icons/material-symbols/battery-4-bar-rounded';
import MaterialSymbolsBattery3BarRounded from '~icons/material-symbols/battery-3-bar-rounded';
import MaterialSymbolsBattery2BarRounded from '~icons/material-symbols/battery-2-bar-rounded';
import MaterialSymbolsBattery1BarRounded from '~icons/material-symbols/battery-1-bar-rounded';
import MaterialSymbolsBattery0BarRounded from '~icons/material-symbols/battery-0-bar-rounded';
import MaterialSymbolsPowerPlugOutlineRounded from '~icons/material-symbols/power-plug-outline-rounded';


const props = defineProps({
    refs: { type: Map<string, any>, required: false, default: () => { } }
});
const critical = props.refs.get("ects/battery/is_critical") as std_msgs.Bool;
watch(() => props.refs.get("ects/battery/is_critical"), (newVal) => {
    critical.data = newVal.data;
});
const usage = props.refs.get("ects/battery/usage") as sensor_msgs.BatteryState;
watch(() => props.refs.get("ects/battery/usage"), (newVal: sensor_msgs.BatteryState) => {
    usage.percentage = newVal.percentage;
    usage.capacity = newVal.capacity;
    usage.design_capacity = newVal.design_capacity;
    usage.charge = newVal.charge;
    usage.current = newVal.current;
    usage.power_supply_health = newVal.power_supply_health;
    usage.power_supply_status = newVal.power_supply_status;
    usage.power_supply_technology = newVal.power_supply_technology;
    usage.voltage = newVal.voltage;
});
const estimated = props.refs.get("ects/battery/estimated_time_remaining") as std_msgs.Float32;
watch(() => props.refs.get("ects/battery/estimated_time_remaining"), (newVal) => {
    estimated.data = newVal.data;
});
</script>

<style scoped></style>