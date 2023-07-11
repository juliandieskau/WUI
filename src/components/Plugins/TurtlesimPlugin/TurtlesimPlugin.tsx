import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import Glayout from "@/components/Glayout.vue";
import { ECTS } from "@/ECTS/ECTS";
import type { TurtlesimPose } from "./TurtleSimMessage";

export default class TurtlesimPlugin extends ECTSPlugin {
    constructor() {
        super("TurtlesimPlugin", "Turtlesim", {
            topics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
            footerTopics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
            componentNames: ["TurtlesimPlugin"],
        });
    }
}