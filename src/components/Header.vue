<script setup lang="ts" >
const props = defineProps({
    urls: { type: Array<string>, required: true }
});

const emits = defineEmits({
    sidebarOpen: () => true,
    selectConnection: (url: string) => true
});

const connection = ref(props.urls[0]);

import MaterialSymbolsMenu from '~icons/material-symbols/menu';
import MaterialSymbolsAddCircle from '~icons/material-symbols/add-circle';
import { ref } from 'vue';
</script>

<template>
    <header>
        <button title="Menu" id="sidebar-btn" @click="$emit('sidebarOpen')">
            <material-symbols-menu style="font-size: 2em;" />
        </button>
        <select id="select-robot" v-model="connection" @change="$emit('selectConnection', connection)">
            <option v-for="url in urls" :key="url">
                {{ url }}
            </option>
        </select>
        <button id="add-robot-btn">
            <material-symbols-add-circle style="font-size: 2em;" />
        </button>
    </header>
</template>

<style scoped>
header {
    width: 100%;
    height: 80px;
    background-color: var(--color-background-soft);
    display: flex;
    align-items: stretch;
    align-content: stretch;
    justify-content: flex-start;
}

button {
    aspect-ratio: 1;
    background-color: var(--color-background-mute);
    border: none;
    cursor: pointer;
    color: var(--text-color);
    font-size: 24px;
}

select#select-robot {
    width: 450px;
    background-color: transparent;
    border-color: var(--color-text);
    border-radius: 0 0 8px 0;
    color: var(--color-text);
    font-size: 3em;
}

select:focus {
    outline: none;
}

option {
    background-color: var(--color-background-soft);
    color: var(--text-color);
}


#add-robot-btn {
    background-color: transparent;

}
</style>