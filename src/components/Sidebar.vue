<script setup lang="ts">
const props = defineProps({
    extended: Boolean
});
</script>

<template>
    <div id="sidebar" :class="extended ? 'extended' : null">
        <div id="sidebar-top">
            <button id="close" @click="$emit('sidebarClose')">Close</button>
            <h1>Sidebar</h1>
        </div>
    </div>
</template>

<style scoped>
#sidebar {
    top: 0;
    background-color: var(--color-background-soft);
    position: fixed;
    left: -300px;
    z-index: 100;
    transition: left 0.3s ease-in-out;
    opacity: 0;
    height: 100vh;
}

#sidebar.extended {
    left: 0;
    opacity: 1;
}

#sidebar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding-right: 10px;
}

#close {
    align-self: stretch;
    aspect-ratio: 1;
    background-color: var(--color-background-mute);
    border: none;
    cursor: pointer;
    color: var(--text-color);
    font-size: 24px;
}
</style>