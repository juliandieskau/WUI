<script setup lang="ts" >
import type { VNode } from 'vue';

const props = defineProps({
    data: {
        type: Map<string, Map<string, VNode>>,
        required: false,
        default: () => new Map(),
    },
});

</script>

<template>
    <footer class="inline">
        <div v-for="[key, value] in props.data" :key="key" class="item">
            <component v-for="[ikey, ivalue] in value" :key="ikey" :is="ivalue" />
        </div>
    </footer>
</template>

<style scoped>
footer {
    width: 100%;
    height: 60px;
    background-color: var(--color-background-soft);
    box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.25);
    z-index: 10;
}

.inline {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.item {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 500px;
    font-size: 20px;
    padding: 10px;
}
</style>