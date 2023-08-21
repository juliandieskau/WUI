<template>
  <div class="controls">
    <button
      @mousedown="Control.startDirection('tleft')"
      @mouseup="Control.stopDirection('tleft')"
      @mouseleave="Control.stopDirection('tleft')"
    >
      <MaterialSymbolsRotateLeft />
    </button>
    <button
      @mousedown="Control.startDirection('forward')"
      @mouseup="Control.stopDirection('forward')"
      @mouseleave="Control.stopDirection('forward')"
    >
      <MaterialSymbolsArrowUpwardAlt />
    </button>
    <button
      @mousedown="Control.startDirection('tright')"
      @mouseup="Control.stopDirection('tright')"
      @mouseleave="Control.stopDirection('tright')"
    >
      <MaterialSymbolsRotateRight />
    </button>
    <button
      @mousedown="Control.startDirection('left')"
      @mouseup="Control.stopDirection('left')"
      @mouseleave="Control.stopDirection('left')"
    >
      <MaterialSymbolsArrowLeftAlt />
    </button>
    <button
      @mousedown="Control.startDirection('backward')"
      @mouseup="Control.stopDirection('backward')"
      @mouseleave="Control.stopDirection('backward')"
    >
      <MaterialSymbolsArrowDownwardAlt />
    </button>
    <button
      @mousedown="Control.startDirection('right')"
      @mouseup="Control.stopDirection('right')"
      @mouseleave="Control.stopDirection('right')"
    >
      <MaterialSymbolsArrowRightAlt />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ECTS } from '../../../ECTS/ECTS';
import { geometry_msgs } from '../../../ECTS/Types/Messages';
import ROSLIB from 'roslib';

import MaterialSymbolsRotateLeft from '~icons/material-symbols/rotate-left';
import MaterialSymbolsRotateRight from '~icons/material-symbols/rotate-right';
import MaterialSymbolsArrowLeftAlt from '~icons/material-symbols/arrow-left-alt';
import MaterialSymbolsArrowRightAlt from '~icons/material-symbols/arrow-right-alt';
import MaterialSymbolsArrowUpwardAlt from '~icons/material-symbols/arrow-upward-alt';
import MaterialSymbolsArrowDownwardAlt from '~icons/material-symbols/arrow-downward-alt';

const CONTROL_TOPIC = '/ects/control/cmd';

const props = defineProps({
  refs: {
    type: Map<string, ROSLIB.Message>,
    required: false,
    default: () => {}
  }
});

window.addEventListener('gamepadconnected', event => {
  console.log('A gamepad connected:', event.gamepad.id);
  Control.mode = 'gamepad';
  Control.active = true;
  props.refs.set('#control-active', 'gamepad');
  Control.gamepad = navigator.getGamepads()[event.gamepad.index];
  Control.interval = setInterval(() => {
    topic.publish(Control.getTwist());
  }, 100);
});

window.addEventListener('gamepaddisconnected', event => {
  console.log('A gamepad disconnected:', event.gamepad.id);
  Control.mode = 'buttons';
});

const topic = new ROSLIB.Topic({
  ros: (props.refs.get('#ects') as ECTS).getRos(),
  name: CONTROL_TOPIC,
  messageType: 'geometry_msgs/Twist'
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
  static mode: 'gamepad' | 'buttons' = 'buttons';
  static gamepad: Gamepad | null = null;

  static interval: number;

  static startDirection(direction: string) {
    Control.active = [...Control.directions.values()].some(value => value);
    if (!Control.active)
      Control.interval = setInterval(() => {
        topic.publish(Control.getTwist());
      }, 100);
    Control.directions.set(direction, true);
    Control.active = true;
    props.refs.set('#control-active', 'buttons');
  }
  static stopDirection(direction: string) {
    Control.directions.set(direction, false);
    Control.active = [...Control.directions.values()].some(value => value);
    if (!Control.active) {
      clearInterval(Control.interval);
      props.refs.set('#control-active', false);
    }
  }

  static getTwist() {
    switch (Control.mode) {
      case 'gamepad':
        return {
          linear: {
            x: Control.gamepad?.axes[1] ?? 0,
            y: 0,
            z: 0
          },
          angular: {
            x: 0,
            y: 0,
            z: Control.gamepad?.axes[0] ?? 0
          }
        } as geometry_msgs.Twist;
      case 'buttons':
        return {
          linear: {
            x:
              (Control.directions.get('forward') ? 1 : 0) +
              (Control.directions.get('backward') ? -1 : 0),
            y:
              (Control.directions.get('left') ? 1 : 0) +
              (Control.directions.get('right') ? -1 : 0),
            z: 0
          },
          angular: {
            x: 0,
            y: 0,
            z:
              (Control.directions.get('tleft') ? 1 : 0) +
              (Control.directions.get('tright') ? -1 : 0)
          }
        } as geometry_msgs.Twist;
    }
  }
}
</script>

<style scoped>
.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.1rem;
  height: 100%;
}

.controls button svg {
  width: 100%;
  height: 100%;
  fill: var(--color-text);
  transition: fill 0.2s;
}
</style>
