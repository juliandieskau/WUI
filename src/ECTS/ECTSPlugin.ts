import Glayout from "@/components/Glayout.vue";
import { reactive } from "vue";
import { ECTS } from "./ECTS";
import ROSLIB from "roslib";
import ComponentExistsError from "./Types/Errors";

export abstract class ECTSPlugin {
    name: string = "ECTSPlugin";
    path: string = "src/components/Plugins/ECTSPlugin.vue";
    humanName: string = "ECTS Plugin";
    topics: Map<string, string> = new Map();
    data: Map<string, ROSLIB.Message> = reactive(new Map<string, ROSLIB.Message>());
    componentNames: string[] = [];

    constructor(name: string, humanName: string, options?: { topics?: Map<string, string>, footerTopics?: Map<string, string>, componentNames?: string[] }) {
        this.name = name;
        this.humanName = humanName;
        if (options?.topics) this.topics = options.topics;
        this.data = reactive(new Map());
        if (options?.componentNames) this.componentNames = options.componentNames;
    }
    init(glayout: InstanceType<typeof Glayout>, ects: ECTS): void {
        console.log(`init ${this.name} (${this.componentNames.length}c  ${this.topics.size}t)`);
        this.componentNames.forEach(async (componentName) => {
            const absolutePath = `../components/Plugins/${this.name}/${componentName}`;
            try {
                await glayout.addGLComponentWithRef(this, absolutePath);
            }
            catch (e) {
                if (e instanceof ComponentExistsError) {
                    console.log(`Component ${componentName} already exists in the layout. skipping`);
                }
            }
        });
    };
    update(topic: string, message: any): void {
        this.data.set(topic, message);
    };
    close(): void {
        this.data.clear();
        console.log(`close ${this.name}`);
    };
} 