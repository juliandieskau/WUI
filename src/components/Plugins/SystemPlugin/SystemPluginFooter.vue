<template>
  <div>
    <div v-if="props.refs.get('/ects/system/cpu/usage')">
      <fa6-solid-microchip />
      <span
        >{{
          (
            (props.refs.get('/ects/system/cpu/usage') as ects_msgs.CpuUsage).total_usage * 100
          ).toFixed(1)
        }}%</span
      >
    </div>
    <div v-if="props.refs.get('/ects/system/mem/usage')">
      <bi-memory />
      <span
        >{{
          (
            ((props.refs.get('/ects/system/mem/usage') as ects_msgs.MemoryUsage).used /
              (props.refs.get('/ects/system/mem/usage') as ects_msgs.MemoryUsage).total) *
            100
          ).toFixed(0)
        }}%</span
      >
    </div>
    <div v-if="totalDiskUsage">
      <carbon-vmdk-disk />
      <span>{{ totalDiskUsage }}%</span>
    </div>
    <div v-if="wifiSignalStrength && wifiSsid">
      <template v-if="wifiSignalStrength > -50">
        <material-symbols-wifi-rounded />
      </template>
      <template v-else-if="wifiSignalStrength > -60">
        <material-symbols-wifi1-bar-rounded />
      </template>
      <template v-else>
        <material-symbols-wifi2-bar-rounded />
      </template>
      <span>{{ wifiSsid }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ects_msgs } from '@/ECTS/Types/Messages';
import Fa6SolidMicrochip from '~icons/fa6-solid/microchip';
import BiMemory from '~icons/bi/memory';
import CarbonVmdkDisk from '~icons/carbon/vmdk-disk';
import MaterialSymbolsWifiRounded from '~icons/material-symbols/wifi-rounded';
import MaterialSymbolsWifi1BarRounded from '~icons/material-symbols/wifi-1-bar-rounded';
import MaterialSymbolsWifi2BarRounded from '~icons/material-symbols/wifi-2-bar-rounded';

import { computed } from 'vue';

const props = defineProps({
  refs: { type: Map<string, any>, required: true, default: () => {} }
});

const totalDiskUsage = computed(() => {
  const disks = props.refs.get('#mountpoint_list');
  if (!disks) return null;
  const sum = disks.reduce((acc: number, disk: string) => {
    const usage = props.refs.get(`/ects/system/disk/${disk}/usage`) as ects_msgs.DiskUsage;
    if (!usage) return acc;
    return acc + (usage.used / usage.size_total) * 100;
  }, 0);

  return (sum / disks.length).toFixed(0);
});

const wifiSignalStrength = computed(() => {
  const network_adapters = props.refs.get('#network_adapters');
  if (!network_adapters) return null;
  const wifi_adapter_name = network_adapters.find((adapter: string) => adapter.startsWith('wl'));
  if (!wifi_adapter_name) return null;
  const usage = props.refs.get(
    `/ects/system/network/${wifi_adapter_name}/usage`
  ) as ects_msgs.NetworkUsage;
  return usage.wifi_signal_strength;
});

const wifiSsid = computed(() => {
  const network_adapters = props.refs.get('#network_adapters') as ects_msgs.AdapterList;
  const wifi_adapter_name = network_adapters.adapters.find((adapter: string) =>
    adapter.startsWith('w')
  );
  if (!wifi_adapter_name) return null;
  const info = props.refs.get(
    `/ects/system/network/${wifi_adapter_name}/info`
  ) as ects_msgs.NetworkInfo;
  return info.wlan_ssid;
});
</script>

<style scoped>
span {
  padding-left: 4px;
}
</style>
