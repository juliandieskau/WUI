<script setup lang="ts">
import Header from '@/components/Header.vue';
import Main from '@/components/Main.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import { ref } from 'vue';
import { ECTS } from '@/ECTS/ECTS';

const ects1 = new ECTS("ws://localhost:9090");

const sidebar_extended = ref(false);

const footer = ects1.getFooter();

</script>

<template>
    <Sidebar :extended="sidebar_extended" @sidebarClose="sidebar_extended = false" />
    <div class="grid">
        <Header @sidebarOpen="sidebar_extended = true" />
        <Main :ects="ects1" />
        <Footer :data="footer" />
    </div>
</template>

<style scoped>
.grid {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.grid>* {
    align-self: stretch;
}
</style>