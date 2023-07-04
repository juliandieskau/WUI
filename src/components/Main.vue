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

    for (const [plugin, active] of props.ects.getPlugins().value) {
        plugin.init(GLayoutRootConverted, props.ects);
    }

});

</script>


<template>
    <main>
        <glayout ref="GLayoutRoot" style="width: 100%; height: 100%;"></glayout>
        <div v-if="ects.getStatus().value == 'pending'" class="loading"></div>
    </main>
</template>


<style>
main {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.loading {
    width: 100px;
    height: 100px;
    border: 10px solid var(--color-background-soft);
    border-top-color: var(--color-text);
    border-radius: 100%;
    animation: spin 1s infinite linear;
    position: fixed;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>