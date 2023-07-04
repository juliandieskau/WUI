import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class MapPlugin extends ECTSPlugin {
    constructor() {
        super("MapPlugin", "Map", { componentPaths: ["/src/ECTS/Plugins/MapPlugin/MapPlugin"] });
    }

}