import { ECTS } from "@/ECTS/ECTS";
import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class ControlPlugin extends ECTSPlugin {
    constructor(ects: ECTS) {
        super("control", "Control", ects,
            {
                componentNames: ["ControlPlugin"],
            });
    }
}
