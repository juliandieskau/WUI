<script setup lang="ts">
import { ECTS } from '@/ECTS/ECTS';
import { ECTSPlugin } from '@/ECTS/ECTSPlugin';
import { Ref } from 'vue';

import MaterialSymbolsMenu from '~icons/material-symbols/menu';
import MdiEyeOffOutline from '~icons/mdi/eye-off-outline';
import MdiEyeOutline from '~icons/mdi/eye-outline';

const props = defineProps({
    extended: Boolean,
    ects: { type: ECTS, required: true },
});
</script>

<template>
    <div id="sidebar" :class="extended ? 'extended' : null">
        <div id="sidebar-top">
            <h1>Plugins</h1>
            <button id="close" @click="$emit('sidebarClose')"><material-symbols-menu style="font-size: 2em;" /></button>
        </div>
        <div id="sidebar-main">
            <div v-for="([plugin, active], index) in ects.getPlugins()" :key="index" class="plugin">
                <div :class="active ? 'active' : 'inactive'" class="name">
                    {{ plugin.humanName }}
                </div>
                <button @click="active ? ects.deactivatePlugin(plugin) : ects.activatePlugin(plugin)" class="eye"
                    :title="active ? 'disable' : 'enable'" type="button">
                    <mdi-eye-outline v-if="active" />
                    <mdi-eye-off-outline v-else style="color: var(--color-important)" />
                </button>
                <div class="description">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#sidebar {
    top: 0;
    background-color: var(--color-background-mute);
    border-radius: 0 16px 16px 0;
    position: fixed;
    left: -500px;
    z-index: 100000;
    transition: left 0.3s ease-in-out;
    height: 100vh;
    width: 500px;
}

#sidebar.extended {
    box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
    left: 0;
    opacity: 1;
}

#sidebar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    height: 80px;
    width: 500px;
    padding: 20px;
}

#close {
    aspect-ratio: 1;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    font-size: 24px;
}

#sidebar-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    height: calc(100vh - 80px);
    padding: 20px;
}

.inactive::after {
    content: " (disabled)";
    color: var(--color-background-mute);
}

.plugin {
    align-self: stretch;
    font-size: 1.5em;
    padding: 0 8px;
    background-color: var(--color-background-soft);
    border-radius: 8px;
    display: grid;
    grid-template-areas:
        'name eye'
        'description description';
    justify-content: space-between;

}

.description {
    grid-area: description;
    color: var(--color-background-mute);
}

.name {
    grid-area: name;
}

.eye {
    grid-area: eye;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--text-color);
    font-size: 22px;
    display: flex;
    align-items: center;
}
</style>