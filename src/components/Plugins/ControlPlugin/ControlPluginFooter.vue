<template>
  <div>
    <div
      v-if="props.refs.get('#control-active') == 'gamepad'"
      style="color: green"
    >
      <GgController />
    </div>
    <div
      v-else-if="props.refs.get('#control-active') == 'buttons'"
      style="color: green"
    >
      <MaterialSymbolsControlCamera />
    </div>
    <div v-else>
      <PepiconsPencilControllerOff />
    </div>
  </div>
</template>

<script setup lang="ts">
import GgController from '~icons/gg/controller';
import PepiconsPencilControllerOff from '~icons/pepicons-pencil/controller-off';
import MaterialSymbolsControlCamera from '~icons/material-symbols/control-camera';

const props = defineProps({
  refs: {
    type: Map<string, ROSLIB.Message>,
    required: false,
    default: () => {}
  }
});
</script>

<style scoped></style>
