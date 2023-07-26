import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class ControlPlugin extends ECTSPlugin {
    constructor(ects: ECTS) {
        super("ControlPlugin", "Control", ects,
            {
                componentNames: ["ControlPlugin"],
            });
        this.data.set("#ects", this.ects);
    }
}
