<template>
	<div ref="GLComponent" class="gl-component">
		<slot :refs="props.refs"></slot>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	refs: { type: Object, required: false, default: () => { } }
});

const GLComponent = ref<null | HTMLElement>(null);

const numberToPixels = (value: number): string => `${value.toString(10)}px`;

const setPosAndSize = (left: number, top: number, width: number, height: number): void => {
	if (GLComponent.value) {
		const el = GLComponent.value as HTMLElement;
		el.style.left = numberToPixels(left);
		el.style.top = numberToPixels(top);
		el.style.width = numberToPixels(width);
		el.style.height = numberToPixels(height);
		el.dispatchEvent(new Event("resize"));
	}
};

const setVisibility = (visible: boolean): void => {
	if (GLComponent.value) {
		const el = GLComponent.value as HTMLElement;
		if (visible) {
			el.style.display = "";
		} else {
			el.style.display = "none";
		}
	}
};

const setZIndex = (value: string): void => {
	if (GLComponent.value) {
		const el = GLComponent.value as HTMLElement;
		el.style.zIndex = value;
	}
};

defineExpose({
	setPosAndSize,
	setVisibility,
	setZIndex
});
</script>

<style scoped>
div.gl-component {
	background-color: var(--color-background-mute);
	position: absolute;
	overflow-y: scroll;
	overflow-x: hidden;
}

::-webkit-scrollbar {
	width: 0px;
	background: transparent;
}
</style>