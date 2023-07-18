import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import { Message } from "roslib";
import { sensor_msgs, std_msgs } from "@/ECTS/Types/Messages";

export default class DefaultPlugin extends ECTSPlugin {
    private iteration: number = 0;

    constructor() {
        super("BatteryPlugin", "Battery Plugin",
            {
                componentNames: ["BatteryPlugin"],
                topics: new Map<string, string>([
                    ["etcs/battery/usage", "sensor_msgs/BatteryState"],
                    ["etcs/battery/is_critical", "std_msgs/Bool"],
                    ["etcs/battery/estimated_time_remaining", "std_msgs/Float32"]]),
            });
        this.data.set("etcs/battery/usage", { percentage: 0.15, voltage: 12.7, power_supply_health: sensor_msgs.POWER_SUPPLY_HEALTH_COLD, power_supply_status: sensor_msgs.POWER_SUPPLY_STATUS_CHARGING, power_supply_technology: sensor_msgs.POWER_SUPPLY_TECHNOLOGY_LIPO, charge: 2.2, current: 3.5, capacity: 20.2, design_capacity: 20.8 } as sensor_msgs.BatteryState);
        this.data.set("etcs/battery/is_critical", { data: true } as std_msgs.Bool);
        this.data.set("etcs/battery/estimated_time_remaining", { data: Infinity } as std_msgs.Float32);
    }
    update(topic: string, message: Message) {
        super.update(topic, message);
    };
}
