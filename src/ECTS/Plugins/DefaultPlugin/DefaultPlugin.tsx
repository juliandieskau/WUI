import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import { } from "@/ECTS/Plugins/DefaultPlugin/DefaultPlugin";

export default class DefaultPlugin extends ECTSPlugin {
    constructor() {
        super("DefaultPlugin", "Default Plugin",
            {
                componentPaths: ["/src/ECTS/Plugins/DefaultPlugin/DefaultPlugin"]
            });
        this.footerData.set("test", <div>Test</div>);
    }

}
