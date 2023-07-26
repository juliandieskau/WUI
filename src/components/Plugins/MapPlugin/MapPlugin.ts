import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class MapPlugin extends ECTSPlugin {
    constructor(ects: ECTS) {
        super("MapPlugin", "Map", ects, {
            componentNames: ["MapPlugin"],
            topics: new Map([
                ["/ects/control/position", "nav_msgs/Odometry"],
                ["/ects/waypoints/waypoint_list", "WaypointList"],
                ["/ects/waypoints/current_waypoint", "std_msgs/UInt32"]])
        });
    }

}