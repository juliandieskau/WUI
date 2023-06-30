import ROSLIB from 'roslib';
import { reactive, ref, type Ref, type VNode } from 'vue';
import type { ECTSPlugin } from './ECTSPlugin';
export class ECTS {
    private ros: ROSLIB.Ros;
    private topics: Map<string, ROSLIB.Topic[]> = new Map();
    private footer: Map<string, Map<string, VNode>> = reactive(new Map());
    private plugins: Ref<ECTSPlugin[]> = ref([]);
    private pluginFromModule(path: string, module: any): ECTSPlugin | undefined {
        const pluginFolderRegex = /^\.\/Plugins\/([^/]+)\/\1.ts[x]?$/;
        if (!pluginFolderRegex.test(path)) return;
        const plugin = new (module as any).default() as ECTSPlugin;
        return plugin;
    }
    constructor(url: string) {
        this.ros = new ROSLIB.Ros({ url: url });
        const files = import.meta.glob('./Plugins/**/*.{ts,tsx}', { eager: true });
        Object.entries(files).forEach(([path, module]) => {
            const plugin = this.pluginFromModule(path, module);
            if (!plugin) return;
            this.addPlugin(plugin);
        });
    }
    getRos(): ROSLIB.Ros {
        return this.ros;
    }
    getPlugins(): Ref<ECTSPlugin[]> {
        console.log('getPlugins => ', this.plugins);
        return this.plugins;
    }
    addPlugin(plugin: ECTSPlugin) {
        console.log("addPlugin", plugin);
        this.plugins.value.push(plugin);
        this.footer.set(plugin.name, plugin.footerData);
    }
    removePlugin(plugin: ECTSPlugin) {
        console.log("removePlugin", plugin);
        plugin.onRemove();
        this.plugins.value = this.plugins.value.filter((p) => p.name !== plugin.name);
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
    }
    registerFooter(plugin: ECTSPlugin, topicName: string, messageType: string) {
        const topic = new ROSLIB.Topic({ name: topicName, messageType: messageType, ros: this.getRos() });
        this.topics.get(plugin.name) ? this.topics.get(plugin.name)?.push(topic) : this.topics.set(plugin.name, [topic]);
        topic.subscribe((message: ROSLIB.Message) => {
            plugin.updateFooter(topicName, message);
        });
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
    getFooter(): Map<string, Map<string, VNode>> {
        return this.footer;
    }

}