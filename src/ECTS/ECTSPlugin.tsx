import Glayout from "@/components/Glayout.vue";
import { type VNode, reactive } from "vue";
import { ECTS } from "./ECTS";
import ROSLIB from "roslib";

export abstract class ECTSPlugin {
    name: string = "ECTSPlugin";
    humanName: string = "ECTS Plugin";
    topics: Map<string, string> = new Map();
    footerTopics: Map<string, string> = new Map();
    data: Map<string, ROSLIB.Message> = reactive(new Map<string, ROSLIB.Message>());
    footerData: Map<string, VNode> = reactive(new Map<string, VNode>());
    componentPaths: string[] = [];

    constructor(name: string, humanName: string, options?: { topics?: Map<string, string>, footerTopics?: Map<string, string>, componentPaths?: string[] }) {
        this.name = name;
        this.humanName = humanName;
        if (options?.topics) this.topics = options.topics;
        if (options?.footerTopics) this.footerTopics = options.footerTopics;
        this.data = reactive(new Map());
        this.footerData = reactive(new Map());
        if (options?.componentPaths) this.componentPaths = options.componentPaths;
        console.log(`${this.name} constructor`);
    }
    init(glayout: InstanceType<typeof Glayout>, ects: ECTS): void {
        this.topics.forEach((messageType, topic) => ects.registerListener(this, topic, messageType));
        this.footerTopics.forEach((messageType, topic) => ects.registerFooter(this, topic, messageType));
        this.componentPaths.forEach(async (componentPath) => {
            await glayout.addGLComponentWithRef(this, componentPath);
        });
        console.log(`${this.name} init with ${this.topics.size} topics and ${this.footerTopics.size} footer topics`);
    };
    update(topic: string, message: ROSLIB.Message): void {
        this.data.set(topic, message);
    };
    updateFooter(topic: string, message: ROSLIB.Message): void {
        this.footerData.set(topic, <></>);
    };
    onRemove(): void {
    };
} 