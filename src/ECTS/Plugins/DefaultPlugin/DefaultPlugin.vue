<template>
    HELLO WORLD
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
    color: white;
}

span:last-child {
    padding-left: 10px;
}
</style>