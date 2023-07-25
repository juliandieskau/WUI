<script setup lang="ts">
import Header from '@/components/Header.vue';
import Main from '@/components/Main.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import { reactive, ref } from 'vue';
import { ECTS } from '@/ECTS/ECTS';

const sidebar_extended = ref(false);

const urls: Array<string> = reactive(["ws://localhost:9090"]);
const index = ref(0);
let connection = new ECTS(urls[index.value]);

const reloadCounter = ref(0);

const reload = () => {
    reloadCounter.value++;
};

const addConnection = (url: string): boolean => {
    try {
        let parsed = new URL(url);
        if (parsed.protocol != "ws:") {
            throw new Error("Invalid protocol");
        }
        if (!urls.find(u => u == url)) urls.push(url);
        return true;
    } catch {
        console.error("Invalid URL: ", url);
        return false;
    }
};

const removeConnection = (index: number) => {
    connection.close();
    urls.splice(index, 1);
    reload();
};

const changeConnection = (url: string) => {
    connection.close();
    connection = new ECTS(url);
    reload();
};
</script>

<template>
    <Sidebar :ects="connection" :extended="sidebar_extended" @sidebarClose="sidebar_extended = false" />
    <div class="flex">
        <Header :urls="urls" @selectConnection="changeConnection" @sidebarOpen="sidebar_extended = true"
            @addConnection="addConnection" />
        <Main :ects="connection" :key="reloadCounter" />
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