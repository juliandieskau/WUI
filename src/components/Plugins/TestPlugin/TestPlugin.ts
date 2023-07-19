import { ECTSPlugin } from "@/ECTS/ECTSPlugin";

export default class TestPlugin extends ECTSPlugin {
    private iteration: number = 0;

    constructor() {
        super("TestPlugin", "Test Plugin",
            {
                componentNames: ["TestPlugin"],
                topics: new Map<string, string>([["test1/test", "test/message"]]),
            });
    }
    update(topic: string, message: { test: string }) {
        message.test = message.test + " (" + this.iteration++ + ")";
        super.update(topic, message);
    };
}
