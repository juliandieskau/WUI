import ROSLIB from 'roslib';
import { Component, defineAsyncComponent, markRaw, reactive, ref, type Ref } from 'vue';
import type { ECTSPlugin } from './ECTSPlugin';
import { ects_msgs, geometry_msgs, sensor_msgs, std_msgs } from './Types/Messages';
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
                    if (this.plugins.get(plugin) === false) return;
                    plugin.update(topicName, { test: "test", });
                }, 1000);
            } else if (topicName === "/ects/system/cpu/usage") {
                setInterval(() => {
                    if (this.plugins.get(plugin) === false) return;
                    const array = [Math.random(), Math.random(), Math.random(), Math.random()];
                    plugin.update(topicName, {
                        total_usage: array.reduce((a, b) => a + b, 0) / array.length,
                        per_core_usage: array,
                        load_averages: [Math.random(), Math.random(), Math.random(), Math.random()]
                    } as ects_msgs.CpuUsage);
                }, 1000);
            } else if (topicName === "/ects/system/mem/usage") {
                setInterval(() => {
                    if (this.plugins.get(plugin) === false) return;
                    const total = 8192;
                    const used = Math.random() * total;
                    plugin.update(topicName, {
                        used: used,
                        total: total,
                        free: total - used,
                        shared: Math.random() * 100,
                        buff_cache: Math.random() * 100,
                        available: Math.random() * 100,
                    } as ects_msgs.MemoryUsage);
                }, 1000);
            } else if (topicName === "/ects/battery/usage") {
                let percent = 100;
                setInterval(() => {
                    if (this.plugins.get(plugin) === false) return;
                    percent++;
                    percent = (percent % 100);
                    plugin.update(topicName, {
                        voltage: Math.random() * 100,
                        current: Math.random() * 100,
                        charge: Math.random() * 100,
                        capacity: Math.random() * 100,
                        design_capacity: Math.random() * 100,
                        percentage: percent / 100,
                        power_supply_status: sensor_msgs.POWER_SUPPLY_STATUS_CHARGING,
                        power_supply_health: sensor_msgs.POWER_SUPPLY_HEALTH_GOOD,
                        power_supply_technology: sensor_msgs.POWER_SUPPLY_TECHNOLOGY_LIPO,
                    } as sensor_msgs.BatteryState);
                    plugin.update("/ects/battery/is_critical", { data: percent < 20 } as std_msgs.Bool);
                    plugin.update("/ects/battery/estimated_time_remaining", { data: 100 - percent } as std_msgs.Float32);
                }, 500);
            } else if (topicName === "/ects/control/position") {
                const position = { x: 49.01544629387268, y: 8.426687545524752, theta: 0 } as geometry_msgs.Pose2D;
                setInterval(() => {
                    if (this.plugins.get(plugin) === false) return;
                    position.x += Math.random() * 0.0001 - 0.00005;
                    position.y += Math.random() * 0.0001 - 0.00005;
                    position.theta += Math.random() * 0.001;
                    plugin.update(topicName, position);
                }, 1500);
            } else if (topicName === "/ects/waypoints/waypoint_list") {
                const waypoints: ects_msgs.WaypointList = {
                    name: 'list', waypoints: [
                        { name: "ROBDEKON", pose: { x: 49.01599242886085, y: 8.426672104556637, theta: 0 }, radius: 0.5, heading_accuracy: 0.1, use_heading: true, wait_time: 30 },
                        { name: "Parkplatz", pose: { x: 49.01469739913717, y: 8.426888384587954, theta: 0 }, radius: 0.1, heading_accuracy: 0.1, use_heading: false, wait_time: 0 },
                        { name: "IOSB", pose: { x: 49.01545445005395, y: 8.425802859938, theta: 0 }, radius: 1.0, heading_accuracy: 0.5, use_heading: true, wait_time: 0 },
                    ]
                };
                let iteration = 0;
                setTimeout(() => {
                    if (this.plugins.get(plugin) === false) return;
                    waypoints.name = 'list' + iteration++;
                    plugin.update("/ects/waypoints/waypoint_list", waypoints);
                }, 1500);
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
        plugin.path = path;
        return plugin;
    }
}