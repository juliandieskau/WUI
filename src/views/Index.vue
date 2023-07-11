<script setup lang="ts">
import Header from '@/components/Header.vue';
import Main from '@/components/Main.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import { Ref, reactive, ref, watch } from 'vue';
import { ECTS } from '@/ECTS/ECTS';

const sidebar_extended = ref(false);

const urls: Array<string> = ["ws://localhost:9090", "ws://localhost:9091"];
const index = ref(0);
let connection = new ECTS(urls[index.value]);

const reload = ref(0);



const changeConnection = (url: string) => {
    connection.close();
    connection = new ECTS(url);
    reload.value++;
};
</script>

<template>
    <Sidebar :ects="connection" :extended="sidebar_extended" @sidebarClose="sidebar_extended = false" />
    <div class="flex">
        <Header :urls="urls" @selectConnection="changeConnection" @sidebarOpen="sidebar_extended = true" />
        <Main :ects="connection" :key="reload" />
        <Footer :ects="connection" />
    </div>
    <div v-if="connection.getStatus().value == 'pending'" class="loading"></div>
</template>

<style scoped>
.flex {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.grid>* {
    align-self: stretch;
}
</style>