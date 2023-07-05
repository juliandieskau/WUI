import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import Glayout from "@/components/Glayout.vue";
import { ECTS } from "@/ECTS/ECTS";

export default class DefaultPlugin extends ECTSPlugin {
    constructor() {
        super("TestPlugin", "Test Plugin",
            {
                componentPaths: ["/src/ECTS/Plugins/TestPlugin/TestPlugin"]
            });
        this.footerData.set("test",
            <>
                <div>Test</div>
            </>);
    }
    async init(glayout: InstanceType<typeof Glayout>, ects: ECTS) {
        super.init(glayout, ects);
        setTimeout(() => {
            ects.deactivatePlugin(this);
        }, 1500);
    };

}
