import { ECTSPlugin } from "@/ECTS/ECTSPlugin";
import Glayout from "@/components/Glayout.vue";
import { ECTS } from "@/ECTS/ECTS";
import { Message } from "roslib";

export default class DefaultPlugin extends ECTSPlugin {
    private iteration: number = 0;

    constructor() {
        super("TestPlugin", "Test Plugin",
            {
                componentNames: ["TestPlugin"],
                topics: new Map<string, string>([["test1/test", "test/message"]]),
                footerTopics: new Map<string, string>([["test1/test", "test/message"]])
            });
    }
    update(topic: string, message: { test: string }) {
        message.test = message.test + " (" + this.iteration++ + ")";
        super.update(topic, message);
    };
}
