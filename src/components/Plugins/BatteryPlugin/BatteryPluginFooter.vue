<template>
    <div v-if="props.refs.get('/ects/battery/usage')">
        <div v-if="props.refs.get('/ects/battery/usage').power_supply_status == 1">
            <material-symbols-power-plug-outline-rounded style="color: green; font-size: 1.5em" />
        </div>
        <div v-if="props.refs.get('/ects/battery/usage').percentage"
            :style="props.refs.get('/ects/battery/is_critical').data ? { color: 'var(--color-important) !important' } : {}">
            <material-symbols-battery20-rounded v-if="props.refs.get('/ects/battery/usage').percentage > 0.95" />
            <material-symbols-battery6-bar-rounded v-else-if="props.refs.get('/ects/battery/usage').percentage > 0.8" />
            <material-symbols-battery5-bar-rounded v-else-if="props.refs.get('/ects/battery/usage').percentage > 0.65" />
            <material-symbols-battery4-bar-rounded v-else-if="props.refs.get('/ects/battery/usage').percentage > 0.5" />
            <material-symbols-battery3-bar-rounded v-else-if="props.refs.get('/ects/battery/usage').percentage > 0.35" />
            <material-symbols-battery2-bar-rounded v-else-if="props.refs.get('/ects/battery/usage').percentage > 0.2" />
            <material-symbols-battery1-bar-rounded v-else-if="props.refs.get('/ects/battery/usage').percentage > 0.05" />
            <material-symbols-battery0-bar-rounded v-else />
            {{ (props.refs.get('/ects/battery/usage').percentage * 100).toFixed(1) }}%
            <span v-if="props.refs.get('/ects/battery/estimated_time_remaining')"> ({{
                props.refs.get('/ects/battery/estimated_time_remaining').data }} min) </span>
        </div>
        <div v-else>
            <material-symbols-battery-unknown-rounded />
        </div>
    </div>
</template>

<script setup lang="ts">

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
    refs: { type: Map<string, any>, required: true, default: () => { } }
});
</script>

<style scoped></style>