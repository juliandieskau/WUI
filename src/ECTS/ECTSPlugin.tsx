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
        console.log(`create ${this.name} `);
        this.name = name;
        this.humanName = humanName;
        if (options?.topics) this.topics = options.topics;
        if (options?.footerTopics) this.footerTopics = options.footerTopics;
        this.data = reactive(new Map());
        this.footerData = reactive(new Map());
        if (options?.componentPaths) this.componentPaths = options.componentPaths;
    }
    init(glayout: InstanceType<typeof Glayout>, ects: ECTS): void {
        console.log(`init ${this.name} (${this.componentPaths.length}  ${this.topics.size}  ${this.footerTopics.size})`);
        this.topics.forEach((messageType, topic) => ects.registerListener(this, topic, messageType));
        this.footerTopics.forEach((messageType, topic) => ects.registerFooter(this, topic, messageType));
        this.componentPaths.forEach(async (componentPath) => {
            await glayout.addGLComponentWithRef(this, componentPath);
        });
    };
    update(topic: string, message: ROSLIB.Message): void {
        this.data.set(topic, message);
    };
    updateFooter(topic: string, message: ROSLIB.Message): void {
        this.footerData.set(topic, <></>);
    };
    onDeactivate(): void {
    };
} 