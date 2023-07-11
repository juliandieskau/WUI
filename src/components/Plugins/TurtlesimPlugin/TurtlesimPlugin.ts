import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class TurtlesimPlugin extends ECTSPlugin {
    constructor() {
        super("TurtlesimPlugin", "Turtlesim", {
            topics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
            footerTopics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
            componentNames: ["TurtlesimPlugin"],
        });
        this.data.set("turtle1/pose", { x: 0, y: 0, theta: 0, linear_velocity: 0, angular_velocity: 0 });
    }
}