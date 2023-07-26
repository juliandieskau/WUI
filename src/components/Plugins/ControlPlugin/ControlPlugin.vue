<template>
    <button @mousedown="Control.startDirection('forward')" @mouseup="Control.stopDirection('forward')">forward</button>
    <button @mousedown="Control.startDirection('backward')" @mouseup="Control.stopDirection('backward')">backward</button>
    <button @mousedown="Control.startDirection('left')" @mouseup="Control.stopDirection('left')">left</button>
    <button @mousedown="Control.startDirection('right')" @mouseup="Control.stopDirection('right')">right</button>
    <button @mousedown="Control.startDirection('tleft')" @mouseup="Control.stopDirection('tleft')">turn left</button>
    <button @mousedown="Control.startDirection('tright')" @mouseup="Control.stopDirection('tright')">turn right</button>
</template>

<script setup lang="ts">

import { ECTS } from '../../../ECTS/ECTS';
import { geometry_msgs } from '../../../ECTS/Types/Messages';
import ROSLIB from 'roslib';

const props = defineProps({
    refs: { type: Map<string, ROSLIB.Message>, required: false, default: () => { } }
});

const topic = new ROSLIB.Topic({
    ros: (props.refs.get("#ects") as ECTS).getRos(),
    name: "/turtle1/cmd_vel",
    messageType: "geometry_msgs/Twist"
});


class Control {
    static directions = new Map([
        ['forward', false],
        ['backward', false],
        ['left', false],
        ['right', false],
        ['tleft', false],
        ['tright', false]
    ] as [string, boolean][]);
    static active = false;

    static interval: number;

    static startDirection(direction: string) {
        Control.active = [...Control.directions.values()].some((value) => value);
        if (!Control.active) Control.interval = setInterval(() => {
            topic.publish(Control.getTwist(),);
        }, 100);
        Control.directions.set(direction, true);
        Control.active = true;
        props.refs.set("#control-active", true);
    }
    static stopDirection(direction: string) {
        Control.directions.set(direction, false);
        Control.active = [...Control.directions.values()].some((value) => value);
        if (!Control.active) {
            clearInterval(Control.interval);
            props.refs.set("#control-active", false);
        }
    }

    static getTwist() {
        return {
            linear: {
                x: (Control.directions.get("forward") ? 1 : 0) + (Control.directions.get("backward") ? -1 : 0),
                y: (Control.directions.get("left") ? 1 : 0) + (Control.directions.get("right") ? -1 : 0),
                z: 0
            },
            angular: {
                x: 0,
                y: 0,
                z: (Control.directions.get("tleft") ? 1 : 0) + (Control.directions.get("tright") ? -1 : 0)
            }
        } as geometry_msgs.Twist;
    }
}

</script>

<style scoped></style>