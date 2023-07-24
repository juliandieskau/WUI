import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import { Message } from "roslib";
import { sensor_msgs, std_msgs } from "@/ECTS/Types/Messages";

export default class BatteryPlugin extends ECTSPlugin {
    private iteration: number = 0;

    constructor() {
        super("BatteryPlugin", "Battery Plugin",
            {
                componentNames: ["BatteryPlugin"],
                topics: new Map<string, string>([
                    ["/ects/battery/usage", "sensor_msgs/BatteryState"],
                    ["/ects/battery/is_critical", "std_msgs/Bool"],
                    ["/ects/battery/estimated_time_remaining", "std_msgs/Float32"]]),
            });
    }
    update(topic: string, message: Message) {
        super.update(topic, message);
    };
}
