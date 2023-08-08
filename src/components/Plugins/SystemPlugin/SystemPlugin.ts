import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import { ects_msgs } from "@/ECTS/Types/Messages";
import ROSLIB from "roslib";

export default class SystemPlugin extends ECTSPlugin {
    networkAdapters: string[] = [];
    aggregationList: string[] = [];

    constructor(ects: ECTS) {
        super("systemmonitor", "System Resources", ects, {
            componentNames: ["SystemPlugin"],
            topics: new Map<string, string>([
                ["/ects/system/cpu/usage", "ects/CpuUsage"],
                ["/ects/system/mem/usage", "ects/MemoryUsage"],
            ]),
        });
        this.ects.callService("/ects/system/aggregation", "ects/AggregationList", new ROSLIB.ServiceRequest({})).then((response) => {
            this.aggregationList = (response as ects_msgs.AggregationList).available_aggregations.map((aggregation) => aggregation.ectsname);
            this.data.set('#aggregation_list', this.aggregationList);
            this.aggregationList.forEach((aggregation) => {

                this.topics.set(`/ects/system/averages/${aggregation}/disk`, "ects/Aggregation");
                ects.registerListener(this, `/ects/system/averages/${aggregation}/disk`, 'ects/DiskUsageHistory');

                this.topics.set(`/ects/system/averages/${aggregation}/cpu/usage`, "ects/Aggregation");
                ects.registerListener(this, `/ects/system/averages/${aggregation}/cpu/usage`, 'ects/CpuUsageHistory');

                this.ects.callService("/ects/system/network/adapters", "ects/NetworkAdapters", new ROSLIB.ServiceRequest({})).then((response) => {
                    this.networkAdapters = (response as ects_msgs.AdapterList).adapters;
                    this.data.set('#network_adapters', this.networkAdapters);
                    this.networkAdapters.forEach((adapter) => {
                        this.topics.set(`/ects/system/averages/${aggregation}/network/${adapter}/usage`, "ects/Aggregation");
                        ects.registerListener(this, `/ects/system/averages/${aggregation}/network/${adapter}/usage`, 'ects/NetworkUsageHistory');
                    });
                });

            });
        }).finally(() => { console.log(this.topics); });
    }
    //update(topic: string, message: any): void {
    //    if (topic.startsWith('/ects/system/averages')) console.log(topic, message);
    //    super.update(topic, message);
    //}
}

