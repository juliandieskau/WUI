<script setup lang="ts" >
</script>

<template>
    <header>
        <button id="sidebar-btn" @click="$emit('sidebarOpen')">Menu</button>
        <button id="add-robot-btn">+</button>
    </header>
</template>

<style scoped>
header {
    width: 100%;
    height: 80px;
    background-color: var(--color-background-soft);
    display: flex;
    gap: 10px;
}

button {
    align-self: stretch;
    aspect-ratio: 1;
    background-color: var(--color-background-mute);
    border: none;
    cursor: pointer;
    color: var(--text-color);
    font-size: 24px;
}
</style>