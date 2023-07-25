<script setup lang="ts">
import Header from '@/components/Header.vue';
import Main from '@/components/Main.vue';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import { computed, reactive, ref, watch } from 'vue';
import { ECTS } from '@/ECTS/ECTS';

const sidebar_extended = ref(false);

const urls: Array<string> = reactive(localStorage.getItem("urls") ? JSON.parse(localStorage.getItem("urls")!) : []);
const index = ref(localStorage.getItem("urlIndex") && JSON.parse(localStorage.getItem("urlIndex")!) >= 0 && JSON.parse(localStorage.getItem("urlIndex")!) < urls.length
    ? JSON.parse(localStorage.getItem("urlIndex")!) : 0);
let connection = computed(() => {
    return new ECTS(urls[index.value]);
});

const reloadCounter = ref(0);

const reload = () => {
    reloadCounter.value++;
};

const addConnection = (url: string) => {
    if (!urls.find(u => u == url)) urls.push(url);
    else console.error("URL already exists: ", url);
};

const removeConnection = () => {
    connection.value.close();
    urls.splice(index.value, 1);
    index.value = 0;
    reload();
};

const changeConnection = (newIndex: number) => {
    connection.value.close();
    index.value = newIndex;
    reload();
};

const clearLayout = () => {
    localStorage.removeItem("layout");
    reload();
};

const clearUrls = () => {
    localStorage.removeItem("urls");
    localStorage.removeItem("urlIndex");
    urls.splice(0, urls.length);
    index.value = 0;
    reload();
};

watch(urls, (value) => {
    localStorage.setItem("urls", JSON.stringify(value));
});

watch(index, (value) => {
    localStorage.setItem("urlIndex", JSON.stringify(value));
});
</script>

<template>
    <Sidebar :ects="connection" :extended="sidebar_extended" @sidebarClose="sidebar_extended = false"
        @clearLayout="clearLayout" @clearUrls="clearUrls" @removeConnection="removeConnection" />
    <div class="flex">
        <Header :index="index" :urls="urls" @changeConnection="changeConnection" @sidebarOpen="sidebar_extended = true"
            @addConnection="addConnection" />
        <Main :ects="connection" :key="reloadCounter" />
        <Footer :ects="connection" />
    </div>
    <div class="mode" :class="[connection.getStatus().value, connection.getMode()]">
        <div v-if="connection.getMode() == 'mock'">
            {{ connection.getStatus().value == 'error' ? 'MOCK' : connection.getStatus().value.toUpperCase() }}
        </div>
        <div v-else>
            {{ connection.getStatus().value.toUpperCase() }}
        </div>
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

.mode {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10000;
    padding: 0 5px;
    background-color: var(--color-background-soft);
    font-size: 1.5em;
    font-weight: bold;
}

.pending {
    animation: blinker 1s linear infinite;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}

.mock.error {
    color: var(--color-warning);
}

.error {
    color: var(--color-important);
}

.connected {
    color: var(--color-success);
}
</style>