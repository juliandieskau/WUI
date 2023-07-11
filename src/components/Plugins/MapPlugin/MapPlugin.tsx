import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class MapPlugin extends ECTSPlugin {
    constructor() {
        super("MapPlugin", "Map", { componentNames: ["MapPlugin"] });
    }

}