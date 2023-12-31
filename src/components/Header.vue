<script setup lang="ts">
const props = defineProps({
  urls: { type: Array<string>, required: true },
  index: { type: Number, required: true }
});

const emit = defineEmits(['addConnection', 'changeConnection', 'sidebarOpen']);

const connection = computed({
  get: () => {
    return props.urls[props.index];
  },
  set: value => {
    changeConnection(props.urls.indexOf(value));
  }
});

function addConnection(url: string) {
  try {
    let parsed = new URL(url);
    if (parsed.protocol != 'ws:') {
      throw new Error('Invalid protocol');
    }
    expanded.value = false;
    emit('addConnection', url);
  } catch {
    error.value = true;
    console.error('Invalid URL: ', url);
  }
}

function changeConnection(index: number) {
  if (index >= 0) emit('changeConnection', index);
}

const expanded = ref(false);
const error = ref(false);
const url = ref('');

import MaterialSymbolsMenu from '~icons/material-symbols/menu';
import MaterialSymbolsAddCircle from '~icons/material-symbols/add-circle';
import IcRoundCheck from '~icons/ic/round-check';
import { computed, ref } from 'vue';
</script>

<template>
  <header>
    <button title="Menu" id="sidebar-btn" @click="emit('sidebarOpen')" type="button">
      <material-symbols-menu style="font-size: 2em" />
    </button>
    <select
      id="select-robot"
      v-model="connection"
      title="select connection"
      placeholder="add robot">
      <option v-for="url in urls" :key="url">
        {{ url }}
      </option>
    </select>
    <button
      id="add-robot-btn"
      @click="expanded = !expanded"
      title="add new connection"
      type="button">
      <material-symbols-add-circle style="font-size: 2em" :class="expanded ? 'rotated' : {}" />
    </button>
    <form
      :class="[expanded ? {} : 'hidden', error ? 'error' : {}]"
      class="add-robot"
      @submit.prevent="addConnection(url)">
      <input
        type="text"
        placeholder="ECTS URL"
        v-model="url"
        :disabled="!expanded"
        @input="error = false" />
      <button type="submit" :disabled="!expanded"><ic-round-check /></button>
    </form>
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

#add-robot-btn svg {
  transition: transform 0.2s;
}

.rotated {
  transform: rotate(45deg);
}

.add-robot.hidden {
  opacity: 0;
}

.add-robot {
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: opacity 0.2s;
  opacity: 1;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  align-self: center;
}

.add-robot input {
  border: none;
  border-radius: 8px 0 0 8px;
  font-size: 1em;
  align-self: stretch;
  background-color: var(--color-background-mute);
  color: var(--text-color);
}

.add-robot button {
  border-radius: 0 8px 8px 0;
  border: 1px solid white;
}

.error {
  color: red;
}
</style>
