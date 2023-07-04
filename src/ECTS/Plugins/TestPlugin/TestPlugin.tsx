import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import { } from "@/ECTS/Plugins/TestPlugin/TestPlugin";

export default class DefaultPlugin extends ECTSPlugin {
    constructor() {
        super("TestPlugin", "Test Plugin",
            {
                componentPaths: ["/src/ECTS/Plugins/TestPlugin/TestPlugin"]
            });
        this.footerData.set("test", <div>Test</div>);
    }

}
