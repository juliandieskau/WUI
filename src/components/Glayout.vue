<template>
	<div style="position: relative">
		<div ref="GLRoot" style="position: absolute; width: 100%; height: 100%">
			<!-- Root dom for Golden-Layout manager -->
		</div>
		<div style="position: absolute; width: 100%; height: 100%">
			<gl-component v-for="([key, [component, path]]) in AllComponents" :key="key" :ref="GlcKeyPrefix + key"
				class="gl-component-container">
				<component :is="component" :refs="Refs.get(path)"></component>
			</gl-component>
		</div>
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	plugins: {
		type: Map<ECTSPlugin, Boolean>,
		required: true
	}
});

import { defineAsyncComponent, getCurrentInstance, markRaw, onUnmounted, readonly, ref } from 'vue';
import GlComponent from './GlComponent.vue';
import { ComponentContainer, VirtualLayout } from 'golden-layout';
import { nextTick } from 'vue';
import { onMounted } from 'vue';
import { ComponentItemConfig, LayoutConfig, LogicalZIndex, ResolvedLayoutConfig, RowOrColumnItemConfig, StackItemConfig } from 'golden-layout';
import type { ResolvedComponentItemConfig, Json } from 'golden-layout';
import { ECTSPlugin } from '@/ECTS/ECTSPlugin';
import { localStorageLoad } from '@/ECTS/util/util';
import ComponentExistsError from '@/ECTS/Types/Errors';


const GLRoot = ref<null | HTMLElement>(null);
let GLayout: VirtualLayout;
const GlcKeyPrefix = readonly(ref('glc_'));

const MapComponents = new Map<ComponentContainer, { refId: number, glc: InstanceType<typeof GlComponent> }>();
const AllComponents = ref(new Map<number, any>());
const Refs = ref(new Map<string, Map<string, any>>());
const UnusedIndices: number[] = [];
let CurIndex = 0;
let GlBoundingClientRect: DOMRect;

let debounceTimer: number;

let ComponentPathMap = new Map<string, string[]>();
const instance = getCurrentInstance();

onMounted(async () => {
	await nextTick();
	loadLayout();
});

onUnmounted(() => {
	GLayout.clear();
});

const saveLayout = () => {
	console.log("saving layout");
	const layout = GLayout.saveLayout();
	localStorage.setItem("layout", JSON.stringify(layout));
};

const loadLayout = () => {
	console.log("loading layout");
	const layout: LayoutConfig = localStorageLoad("layout");
	if (!layout) return;

	loadGLLayout(layout);
};

const addRefWithoutComponent = (plugin: ECTSPlugin, path: string) => {
	let ref: Map<string, any> = plugin.data;
	Refs.value.set(path, ref);
};

const addGLComponentWithRef = async (plugin: ECTSPlugin, path: string) => {
	addRefWithoutComponent(plugin, path);
	let index = await addGLComponent(path, plugin.humanName);
	if (index == null) throw new ComponentExistsError("Component already exists");
};

const addGLComponent = async (path: string, title: string) => {
	const pathSplit = path.split("/");
	const componentType = pathSplit.pop() as string;
	const pluginName = pathSplit.pop() as string;
	if (!ComponentPathMap.has(pluginName)) ComponentPathMap.set(pluginName, []);
	if (ComponentPathMap.get(pluginName)!.includes(path)) return null;
	ComponentPathMap.get(pluginName)!.push(path);

	const index = addComponent(path, title);

	await nextTick(); // wait 1 tick for vue to add the dom 

	GLayout.addComponent(componentType, { refId: index, path: path, enabled: true }, title);
	return index;
};

const loadGLLayout = async (
	layoutConfig: LayoutConfig | ResolvedLayoutConfig,
) => {
	const config = (
		((layoutConfig as ResolvedLayoutConfig).resolved)
			? LayoutConfig.fromResolved(layoutConfig as ResolvedLayoutConfig)
			: layoutConfig
	) as LayoutConfig;

	let content = config.root?.content;
	if (!content) return;
	let contents = [content];

	GLayout.clear();
	AllComponents.value.clear();

	let index = 0;
	while (contents.length > 0) {
		const content = contents.shift() as
			| RowOrColumnItemConfig[]
			| StackItemConfig[]
			| ComponentItemConfig[];
		for (let itemConfig of content) {
			if (itemConfig.type == "component") {
				const path = (itemConfig.componentState as { path: string })?.path as string;
				const pathSplit = path.split("/");
				const componentType = pathSplit.pop() as string;
				const pluginName = pathSplit.pop() as string;
				if (!ComponentPathMap.has(pluginName)) ComponentPathMap.set(pluginName, []);
				if (ComponentPathMap.get(pluginName)!.includes(path)) return null;
				ComponentPathMap.get(pluginName)!.push(path);
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

const addComponent = (path: string, title: string) => {
	const pathSplit = path.split("/");
	const componentType = pathSplit.pop() as string;
	const pluginName = pathSplit.pop() as string;
	const glc = markRaw(
		defineAsyncComponent(
			() => import(`../components/Plugins/${pluginName}/${componentType}.vue`).catch(
				(error) => {
					console.error(error);
					return import("@/components/NotFound.vue");
				}
			)
		)
	);

	let index = CurIndex;
	if (UnusedIndices.length > 0) index = UnusedIndices.pop() as number;
	else CurIndex++;

	AllComponents.value.set(index, [glc, path]);
	return index;
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

		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			window.dispatchEvent(new Event("resize"));
			saveLayout();
		}, 100);


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

		container.virtualRectingRequiredEvent = (container, width, height) => {
			handleContainerVirtualRectingRequiredEvent(
				container,
				width,
				height
			);
		};

		container.virtualVisibilityChangeRequiredEvent = (container, visible) =>
			handleContainerVirtualVisibilityChangeRequiredEvent(
				container,
				visible
			);
		container.virtualZIndexChangeRequiredEvent = (
			container,
			logicalZIndex,
			defaultZIndex
		) => {
			//console.log("handleContainerVirtualZIndexChangeRequiredEvent", container, logicalZIndex, defaultZIndex);
			handleContainerVirtualZIndexChangeRequiredEvent(
				container,
				logicalZIndex,
				((zIndex) => {
					switch (zIndex) {
						case "32":
							return "999999";
						case "41":
							return "999999";
						default:
							return defaultZIndex;
					};
				})(defaultZIndex),
			);
		};

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
		const [, path] = AllComponents.value.get(component.refId);
		ComponentPathMap = new Map([...ComponentPathMap].filter(([, value]) => value != path));
		console.log("unbind: ", path);

		MapComponents.delete(container);
		AllComponents.value.delete(component.refId);
		UnusedIndices.push(component.refId);

		saveLayout();
	};

	GLayout = new VirtualLayout(
		GLRoot.value as HTMLElement,
		bindComponentEventListener,
		unbindComponentEventListener
	);

	GLayout.beforeVirtualRectingEvent = handleBeforeVirtualRectingEvent;
});

defineExpose({
	addGLComponentWithRef,
	addRefWithoutComponent,
	addGLComponent,
});

</script>