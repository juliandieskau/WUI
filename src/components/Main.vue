<script setup lang="ts">
import { ref } from 'vue';
import Glayout from '@/components/Glayout.vue';
import { onMounted } from 'vue';
import { ECTS } from '@/ECTS/ECTS';

const props = defineProps({
    ects: { type: ECTS, required: true }
});

const GLayoutRoot = ref<null | HTMLElement>(null);

onMounted(() => {
    if (!GLayoutRoot.value) throw new Error("GLayoutRoot is null");
    let GLayoutRootConverted = (GLayoutRoot.value as unknown as InstanceType<typeof Glayout>);

    for (const plugin of props.ects.getPlugins().value) {
        plugin.init(GLayoutRootConverted, props.ects);
    }

});

</script>


<template>
    <main>
        <glayout ref="GLayoutRoot" style="width: 100%; height: 100%;"></glayout>
    </main>
</template>


<style>
main {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>