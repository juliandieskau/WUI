import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class SystemPlugin extends ECTSPlugin {
    constructor() {
        super("SystemPlugin", "System Resources",
            {
                componentNames: ["SystemPlugin"],
                topics: new Map<string, string>([
                    ["/ects/system/cpu/usage", "CpuUsage"],
                ]),
            });

    }
}

