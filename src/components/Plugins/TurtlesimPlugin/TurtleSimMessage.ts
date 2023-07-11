import type { Message } from "@/ECTS/Types/Message";

export type TurtlesimPose = Message & {
    x: number;
    y: number;
    theta: number;
    linear_velocity: number;
    angular_velocity: number;

}