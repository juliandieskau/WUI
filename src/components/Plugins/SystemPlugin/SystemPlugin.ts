import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class SystemPlugin extends ECTSPlugin {
    constructor(ects: ECTS) {
        super("SystemPlugin", "System Resources", ects, {
            componentNames: ["SystemPlugin"],
            topics: new Map<string, string>([
                ["/ects/system/cpu/usage", "CpuUsage"],
                ["/ects/system/mem/usage", "MemoryUsage"],
            ]),
        });
    }
}

