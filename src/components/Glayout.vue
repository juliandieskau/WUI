<template>
	<div style="position: relative">
		<div ref="GLRoot" style="position: absolute; width: 100%; height: 100%">
			<!-- Root dom for Golden-Layout manager -->
		</div>
		<div style="position: absolute; width: 100%; height: 100%">
			<gl-component v-for="(pair, index) in AllComponents" :key="pair[0]" :ref="GlcKeyPrefix + pair[0]">
				<component :is="pair[1]" :refs="Refs.get(index)"></component>
			</gl-component>
		</div>
	</div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, getCurrentInstance, markRaw, readonly, ref } from 'vue';
import GlComponent from './GlComponent.vue';
import { ComponentItemConfig, LayoutConfig, RowOrColumnItemConfig, ResolvedLayoutConfig, type StackItemConfig, VirtualLayout } from 'golden-layout';
import { ComponentContainer } from 'golden-layout';
import { nextTick } from 'vue';
import { onMounted } from 'vue';
import type { LogicalZIndex } from 'golden-layout';
import type { ResolvedComponentItemConfig, Json } from 'golden-layout';
import type { ECTSPlugin } from '@/ECTS/ECTSPlugin';


const GLRoot = ref<null | HTMLElement>(null);
let GLayout: VirtualLayout;
const GlcKeyPrefix = readonly(ref('glc_'));

const MapComponents = new Map<ComponentContainer, { refId: number, glc: InstanceType<typeof GlComponent> }>();
const AllComponents = ref(new Map<number, any>());
const Refs = ref(new Map<number, Map<string, any>>());
const UnusedIndices: number[] = [];
let CurIndex = 0;
let GlBoundingClientRect: DOMRect;

const instance = getCurrentInstance();

const addComponent = (path: string, title: string) => {
	const glc = markRaw(
		defineAsyncComponent(
			() => import(/* @vite-ignore */ path + ".vue")
		)
	);

	let index = CurIndex;
	if (UnusedIndices.length > 0) index = UnusedIndices.pop() as number;
	else CurIndex++;

	AllComponents.value.set(index, glc);
	return index;
};

const addGLComponent = async (path: string, title: string) => {
	const index = addComponent(path, title);

	await nextTick(); // wait 1 tick for vue to add the dom 

	const componentType = path.split("/").pop() as string;

	GLayout.addComponent(componentType, { refId: index }, title);
	return index;
};

const addGLComponentWithRef = async (plugin: ECTSPlugin, path: string) => {
	console.log(`${plugin.name} addGLComponentWithRef: ${path}`);
	let ref: Map<string, any> = plugin.data;
	let index = await addGLComponent(path, plugin.humanName);
	Refs.value.set(index, ref);
	console.log(AllComponents);
};


const loadGLLayout = async (
	path: string,
	layoutConfig: LayoutConfig | ResolvedLayoutConfig
) => {
	GLayout.clear();
	AllComponents.value.clear();

	const config = (
		((layoutConfig as ResolvedLayoutConfig).resolved)
			? LayoutConfig.fromResolved(layoutConfig as ResolvedLayoutConfig)
			: layoutConfig
	) as LayoutConfig;

	let contents = [config.root?.content];

	let index = 0;
	while (contents.length > 0) {
		const content = contents.shift() as
			| RowOrColumnItemConfig[]
			| StackItemConfig[]
			| ComponentItemConfig[];
		for (let itemConfig of content) {
			if (itemConfig.type == "component") {
				index = addComponent(
					path,
					itemConfig.title as string
				);
				if (typeof itemConfig.componentState == "object")
					(itemConfig.componentState as { refId?: number })["refId"] = index;
				else itemConfig.componentState = { refId: index };
			} else if (itemConfig.content.length > 0) {
				contents.push(
					itemConfig.content as
					| RowOrColumnItemConfig[]
					| StackItemConfig[]
					| ComponentItemConfig[]
				);
			}
		}
	}

	await nextTick(); // wait 1 tick for vue to add the dom

	GLayout.loadLayout(config);
};

const getLayoutConfig = () => {
	return GLayout.saveLayout();
};

onMounted(() => {
	if (GLRoot.value == null)
		throw new Error("Golden Layout can't find the root DOM!");

	const onResize = () => {
		const dom = GLRoot.value;
		let width = dom ? dom.offsetWidth : 0;
		let height = dom ? dom.offsetHeight : 0;
		GLayout.setSize(width, height);
	};

	window.addEventListener("resize", onResize, { passive: true });

	const handleBeforeVirtualRectingEvent = (count: number) => {
		GlBoundingClientRect = (
			GLRoot.value as HTMLElement
		).getBoundingClientRect();
	};

	const handleContainerVirtualRectingRequiredEvent = (
		container: ComponentContainer,
		width: number,
		height: number
	): void => {
		const component = MapComponents.get(container);
		if (!component || !component?.glc) {
			throw new Error(
				"handleContainerVirtualRectingRequiredEvent: Component not found"
			);
		}

		const containerBoundingClientRect =
			container.element.getBoundingClientRect();
		const left =
			containerBoundingClientRect.left - GlBoundingClientRect.left;
		const top = containerBoundingClientRect.top - GlBoundingClientRect.top;
		((component.glc as unknown as Array<any>)[0] as InstanceType<typeof GlComponent>).setPosAndSize(left, top, width, height);
	};

	const handleContainerVirtualVisibilityChangeRequiredEvent = (
		container: ComponentContainer,
		visible: boolean
	): void => {
		const component = MapComponents.get(container);
		if (!component || !component?.glc) {
			throw new Error(
				"handleContainerVirtualVisibilityChangeRequiredEvent: Component not found"
			);
		}
		((component.glc as unknown as Array<any>)[0] as InstanceType<typeof GlComponent>).setVisibility(visible);
	};

	const handleContainerVirtualZIndexChangeRequiredEvent = (
		container: ComponentContainer,
		logicalZIndex: LogicalZIndex,
		defaultZIndex: string
	): void => {
		const component = MapComponents.get(container);
		if (!component || !component?.glc) {
			throw new Error(
				"handleContainerVirtualZIndexChangeRequiredEvent: Component not found"
			);
		}

		((component.glc as unknown as Array<any>)[0] as InstanceType<typeof GlComponent>).setZIndex(defaultZIndex);
	};

	const bindComponentEventListener = (
		container: ComponentContainer,
		itemConfig: ResolvedComponentItemConfig
	): ComponentContainer.BindableComponent => {
		let refId = -1;
		if (itemConfig && itemConfig.componentState) {
			refId = (itemConfig.componentState as Json).refId as number;
		} else {
			throw new Error(
				"bindComponentEventListener: component's ref id is required"
			);
		}

		const ref = GlcKeyPrefix.value + refId;
		const component = instance?.refs[ref] as InstanceType<typeof GlComponent>;

		MapComponents.set(container, { refId: refId, glc: component });

		container.virtualRectingRequiredEvent = (container, width, height) =>
			handleContainerVirtualRectingRequiredEvent(
				container,
				width,
				height
			);

		container.virtualVisibilityChangeRequiredEvent = (container, visible) =>
			handleContainerVirtualVisibilityChangeRequiredEvent(
				container,
				visible
			);

		container.virtualZIndexChangeRequiredEvent = (
			container,
			logicalZIndex,
			defaultZIndex
		) =>
			handleContainerVirtualZIndexChangeRequiredEvent(
				container,
				logicalZIndex,
				defaultZIndex
			);

		return {
			component,
			virtual: true,
		};
	};

	const unbindComponentEventListener = (
		container: ComponentContainer
	): void => {
		const component = MapComponents.get(container);
		if (!component || !component?.glc) {
			throw new Error("handleUnbindComponentEvent: Component not found");
		}
		MapComponents.delete(container);
		AllComponents.value.delete(component.refId);
		UnusedIndices.push(component.refId);
		console.log("unbind: ", container, component);
	};

	GLayout = new VirtualLayout(
		GLRoot.value as HTMLElement,
		bindComponentEventListener,
		unbindComponentEventListener
	);

	GLayout.beforeVirtualRectingEvent = handleBeforeVirtualRectingEvent;
});

defineExpose({
	addGLComponent,
	addGLComponentWithRef,
	loadGLLayout,
	getLayoutConfig
});

</script>