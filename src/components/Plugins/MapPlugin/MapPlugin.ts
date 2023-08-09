import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import { ects_msgs } from "@/ECTS/Types/Messages";
import L from "leaflet";
import "leaflet.utm";

export default class MapPlugin extends ECTSPlugin {
    constructor(ects: ECTS) {
        super("waypoints", "Map", ects, {
            componentNames: ["MapPlugin"],
            topics: new Map([
                ["/ects/control/position", "nav_msgs/Odometry"],
                ["/ects/waypoints/waypoint_list", "ects/WaypointList"],
                ["/ects/waypoints/current_waypoint", "std_msgs/UInt32"],
                ["/ects/waypoints/is_executing", "std_msgs/Bool"]
            ])
        });
    }
    update(topic: string, message: any): void {
        if (topic === "/ects/waypoints/waypoint_list") {
            const messageCast = message as ects_msgs.WaypointList;
            const waypoints = (message as ects_msgs.WaypointList).waypoints;
            messageCast.waypoints = waypoints.map((waypoint) => {
                const latLng = utmToLatLng(waypoint.pose.x, waypoint.pose.y);
                waypoint.pose.x = latLng.lat;
                waypoint.pose.y = latLng.lng;
                return waypoint;
            });
            this.data.set('#waypoint_list', messageCast);
        }
        super.update(topic, message);
    }
}

function utmToLatLng(x: number, y: number) {
    const latLng = L.utm({ x: x, y: y, zone: 32, band: "U", southHemi: false }).latLng();
    return latLng;
};