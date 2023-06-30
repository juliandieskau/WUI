import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import Glayout from "@/components/Glayout.vue";
import { ECTS } from "@/ECTS/ECTS";
import type { TurtlesimPose } from "./TurtleSimMessage";

export default class TurtlesimPlugin extends ECTSPlugin {
    constructor() {
        super("TurtlesimPlugin", "Turtlesim", {
            topics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
            footerTopics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
            componentPaths: ["/src/ECTS/Plugins/TurtlesimPlugin/TurtlesimPlugin"]
        });
    }
    updateFooter(topic: string, newData: any) {
        switch (topic) {
            case "turtle1/pose":
                newData = newData as TurtlesimPose;
                this.footerData.set(topic, <div>X: {newData.x.toFixed(2)} Y: {newData.y.toFixed(2)}</div>);
        }
    }
    async init(glayout: InstanceType<typeof Glayout>, ects: ECTS) {
        super.init(glayout, ects);
        setTimeout(() => { ects.removePlugin(this); }, 1500);
    };
}