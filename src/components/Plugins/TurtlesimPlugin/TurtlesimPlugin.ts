import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import { geometry_msgs } from "@/ECTS/Types/Messages";


export type TurtlesimPose = geometry_msgs.Pose2D & {
    linear_velocity: number;
    angular_velocity: number;

}

export default class TurtlesimPlugin extends ECTSPlugin {
    constructor(ects: ECTS) {
        super("TurtlesimPlugin", "Turtlesim", ects, {
            componentNames: ["TurtlesimPlugin"],
            topics: new Map([["turtle1/pose", "turtlesim/Pose"]]),
        });
        this.data.set("turtle1/pose", { x: 0, y: 0, theta: 0, linear_velocity: 0, angular_velocity: 0 });
    }
}