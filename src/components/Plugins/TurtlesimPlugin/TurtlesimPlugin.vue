<template>
    <template v-for="[topic, pose] in (props.refs as Map<string, any>)" :key="topic">
        <h1>Turtlesim</h1>
        <span class="key">
            {{ topic }}:
        </span>
        <div v-for="[key, v] in Object.entries(pose)" :key="key">
            <span class="key">
                {{ key }}:
            </span>
            <span class="val">
                {{ (v as number).toFixed(2) }}
            </span>
        </div>
    </template>
</template>

<script setup lang="ts">

const props = defineProps({
    refs: { type: Object, required: false, default: () => { } }
});


</script>

<style scoped>
div {
    font-size: 30px;
    text-align: right;
}

span:first-child {
    color: var(--color-heading);
    font-weight: bold;
}

span:last-child {
    padding-left: 10px;
}
</style>