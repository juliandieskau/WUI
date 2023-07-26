<template>
    <div>
        <div v-if="props.refs.get('#control-active')" style="color: green">
            <GgController />
        </div>
        <div v-else>
            <PepiconsPencilControllerOff />
        </div>
    </div>
</template>

<script setup lang="ts">

import GgController from '~icons/gg/controller';
import PepiconsPencilControllerOff from '~icons/pepicons-pencil/controller-off';

const props = defineProps({
    refs: { type: Map<string, ROSLIB.Message>, required: false, default: () => { } }
});

</script>

<style scoped></style>