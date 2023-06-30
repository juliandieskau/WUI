import type { Message } from "@/ECTS/Types/Messages/Message";

export type DefaultMessage = Message & {
    defaultString: string;
    defaultBool: boolean;

}