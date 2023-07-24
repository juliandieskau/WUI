<script setup lang="ts" >
import { ECTS } from '@/ECTS/ECTS';

const props = defineProps({
    ects: { type: ECTS, required: true }
});


</script>

<template>
    <footer class="inline">
        <div v-for="[plugin, value] in [...ects.getFooter()].filter((([plugin,]) => { return ects.getPlugins().get(plugin) }))"
            :key="plugin.name" class="plugin">
            <component :is="value" class="footer-item" :refs="plugin.data" />
        </div>
    </footer>
</template>

<style scoped>
footer {
    width: 100%;
    height: 60px;
    background-color: var(--color-background-mute);
    box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.25);
    z-index: 10;
    overflow: hidden;
    font-size: 14px;
}

.inline {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.plugin {
    background-color: var(--color-background-softer);
    border-radius: 16px;
    padding: 1px;
}

:global(.footer-item > div),
.footer-item {
    display: flex;
    align-items: center;
    flex-direction: row;
}

:global(.footer-item > div) {
    background-color: var(--color-background-mute);
    border-radius: 16px;
    padding: 6px;
}

.footer-item {
    gap: 2px;
}

:global(.footer-item svg) {
    font-size: 1.5em;
}
</style>