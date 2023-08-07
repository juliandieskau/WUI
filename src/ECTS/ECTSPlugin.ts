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
    ects: ECTS;

    constructor(name: string, humanName: string, ects: ECTS, options?: { topics?: Map<string, string>, footerTopics?: Map<string, string>, componentNames?: string[] }) {
        this.ects = ects;
        this.name = name;
        this.humanName = humanName;
        if (options?.topics) this.topics = options.topics;
        if (options?.componentNames) this.componentNames = options.componentNames;
        this.data = reactive(new Map());
        this.data.set("#ects", this.ects);
    }
    initWindows(glayout: InstanceType<typeof Glayout>, active: boolean): void {
        console.log(`init ${this.name} (${this.componentNames.length}c  ${this.topics.size}t) ${active ? "active" : "inactive"}`);
        this.componentNames.forEach(async (componentName) => {
            const path = this.path.split('/');
            path.pop();
            const absolutePath = `${path.join('/')}/${componentName}`;
            try {
                if (active) await glayout.addGLComponentWithRef(this, absolutePath);
                else glayout.addRefWithoutComponent(this, absolutePath);
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