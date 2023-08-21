import { ECTSPlugin } from '@/ECTS/ECTSPlugin';
import { Message } from 'roslib';
import { ECTS } from '@/ECTS/ECTS';

export default class BatteryPlugin extends ECTSPlugin {
  constructor(ects: ECTS) {
    super('battery', 'Battery', ects, {
      componentNames: ['BatteryPlugin'],
      topics: new Map<string, string>([
        ['/ects/battery/usage', 'sensor_msgs/BatteryState'],
        ['/ects/battery/is_critical', 'std_msgs/Bool'],
        ['/ects/battery/estimated_time_remaining', 'std_msgs/Float32']
      ])
    });
  }
}
