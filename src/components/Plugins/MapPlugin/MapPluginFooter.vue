<template>
  <div v-if="waypointList">
    <div>
      <CodiconActivateBreakpoints :style="is_executing ? 'color: green' : ''" />
      <span>
        {{ waypointList.name }}
        [{{ current_waypoint_index ?? '?' }} / {{ waypointList.waypoints.length }}]
      </span>
    </div>
    <div>
      <MdiRuler />
      <span> {{ waypointList.total_length.toFixed(2) }}m </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ects_msgs, std_msgs } from '@/ECTS/Types/Messages';
import { computed } from 'vue';
import CodiconActivateBreakpoints from '~icons/codicon/activate-breakpoints';
import MdiRuler from '~icons/mdi/ruler';

const props = defineProps({
  refs: { type: Map<string, any>, required: true, default: () => {} }
});

const waypointList = computed(() => {
  return props.refs.get('/ects/waypoints/waypoint_list') as ects_msgs.WaypointList;
});

const current_waypoint_index = computed(() => {
  const index = (props.refs.get('/ects/waypoints/current_waypoint') as std_msgs.UInt32)?.data;
  if (index == null || index >= waypointList.value.waypoints.length) return null;
  return index;
});

const is_executing = computed(() => {
  return (props.refs.get('/ects/waypoints/is_executing') as std_msgs.Bool)?.data;
});
</script>

<style scoped>
span {
  padding-left: 4px;
}
</style>
