import ROSLIB from 'roslib';
import { Component, defineAsyncComponent, markRaw, reactive, ref, type Ref } from 'vue';
import type { ECTSPlugin } from './ECTSPlugin';
import { ects_msgs } from './Types/Messages';
export class ECTS {
    private ros: ROSLIB.Ros;
    private topics: Map<string, ROSLIB.Topic[]> = new Map();
    private plugins: Map<ECTSPlugin, boolean> = reactive(new Map());
    private footer: Map<ECTSPlugin, Component> = reactive(new Map());
    private status: Ref<"pending" | "connected" | "error"> = ref("pending");
    private url: string;

    constructor(url: string) {
        this.url = url;
        this.ros = new ROSLIB.Ros({ url: url });
        this.ros.on('connection', () => { this.status.value = "connected"; });
        this.ros.on('error', () => { this.status.value = "error"; });
        const files = import.meta.glob('../components/Plugins/**/*.ts', { eager: true });
        Object.entries(files).forEach(([path, module]) => {
            const plugin = this.pluginFromModule(path, module);
            if (!plugin) return;
            this.addPlugin(plugin);
        });

        this.plugins.forEach(async (active, plugin) => {
            if (!active) return;
            this.footer.set(plugin, markRaw(defineAsyncComponent(
                () => import(`../components/Plugins/${plugin.name}/${plugin.name}Footer.vue`)
                    .catch(() => { this.footer.delete(plugin); }))));
        });
    }
    getRos(): ROSLIB.Ros {
        return this.ros;
    }
    getUrl(): string {
        return this.url;
    }
    getStatus(): Ref<"pending" | "connected" | "error"> {
        return this.status;
    }
    getPlugins(): Map<ECTSPlugin, boolean> {
        return this.plugins;
    }
    getFooter(): Map<ECTSPlugin, Component> {
        return this.footer;
    }
    addPlugin(plugin: ECTSPlugin) {
        console.log("add ", plugin.name);
        this.activatePlugin(plugin);
    }
    activatePlugin(plugin: ECTSPlugin) {
        console.log("activatePlugin", plugin.name);
        this.plugins.set(plugin, true);
        plugin.topics.forEach((messageType, topic) => this.registerListener(plugin, topic, messageType));
    }
    deactivatePlugin(plugin: ECTSPlugin) {
        console.log("deactivatePlugin", plugin.name);
        this.plugins.set(plugin, false);
        this.unregisterListeners(plugin);
    }
    sendMessage(topic: ROSLIB.Topic, message: ROSLIB.Message) {
        topic.publish(message);
    }
    registerListener(plugin: ECTSPlugin, topicName: string, messageType: string) {
        const topic = new ROSLIB.Topic({ name: topicName, messageType: messageType, ros: this.getRos() });
        this.topics.get(plugin.name) ? this.topics.get(plugin.name)?.push(topic) : this.topics.set(plugin.name, [topic]);
        topic.subscribe((message: ROSLIB.Message) => {
            plugin.update(topicName, message);
        });

        /** TESTING */
        if (import.meta.env.DEV) {
            if (topicName === "test1/test") {
                setInterval(() => {
                    plugin.update(topicName, { test: "test", });
                }, 1000);
            } else if (topicName === "/ects/system/cpu/usage") {
                setInterval(() => {
                    const array = [Math.random(), Math.random(), Math.random(), Math.random()];
                    plugin.update(topicName, {
                        total_usage: array.reduce((a, b) => a + b, 0) / array.length,
                        per_core_usage: array,
                        load_averages: [Math.random(), Math.random(), Math.random(), Math.random()]
                    } as ects_msgs.CpuUsage);
                }, 1000);
            }
        }
    }
    unregisterListener(plugin: ECTSPlugin, listener: ROSLIB.Topic) {
        this.topics.delete(plugin.name);
        listener.unsubscribe();
    }
    unregisterListeners(plugin: ECTSPlugin) {
        this.topics.get(plugin.name)?.forEach((topic) => {
            this.unregisterListener(plugin, topic);
        });
    }
    close() {
        this.plugins.forEach((active, plugin) => {
            this.deactivatePlugin(plugin);
            plugin.close();
        });
        this.ros.close();
    }


    private pluginFromModule(path: string, module: any): ECTSPlugin | undefined {
        const pluginFolderRegex = /^\.\.\/components\/Plugins\/([^/]+)\/\1.ts[x]?$/;
        if (!pluginFolderRegex.test(path)) return;
        const plugin = new (module as any).default() as ECTSPlugin;
        return plugin;
    }
}