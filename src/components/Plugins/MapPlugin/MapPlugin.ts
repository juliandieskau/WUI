import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class MapPlugin extends ECTSPlugin {
    constructor(ects: ECTS) {
        super("waypoints", "Map", ects, {
            componentNames: ["MapPlugin"],
            topics: new Map([
                ["/ects/control/position", "nav_msgs/Odometry"],
                ["/ects/waypoints/waypoint_list", "ects/WaypointList"],
                ["/ects/waypoints/current_waypoint", "std_msgs/UInt32"]])
        });
        this.data.set("#ects", this.ects);
    }
    update(topic: string, message: any): void {
        console.log("MapPlugin.update", topic, message);
        super.update(topic, message);
    }
}