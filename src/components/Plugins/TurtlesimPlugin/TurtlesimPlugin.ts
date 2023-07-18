import { ECTSPlugin } from "@/ECTS/ECTSPlugin";


export type TurtlesimPose = {
    x: number;
    y: number;
    theta: number;
    linear_velocity: number;
    angular_velocity: number;

}

export default class TurtlesimPlugin extends ECTSPlugin {
    constructor() {
        super("TurtlesimPlugin", "Turtlesim", {
            componentNames: ["TurtlesimPlugin"],
            topics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
        });
        this.data.set("turtle1/pose", { x: 0, y: 0, theta: 0, linear_velocity: 0, angular_velocity: 0 });
    }
}