import { ECTS } from '@/ECTS/ECTS';
import { ECTSPlugin } from '@/ECTS/ECTSPlugin';

export default class MapPlugin extends ECTSPlugin {
  constructor(ects: ECTS) {
    super('waypoints', 'Map', ects, {
      componentNames: ['MapPlugin'],
      topics: new Map([
        ['/ects/control/position', 'nav_msgs/Odometry'],
        ['/ects/waypoints/waypoint_list', 'ects/WaypointList'],
        ['/ects/waypoints/current_waypoint', 'std_msgs/UInt32'],
        ['/ects/waypoints/is_executing', 'std_msgs/Bool'],
        ['/ects/imu/current', 'sensor_msgs/Imu'],
        ['/ects/control/filter_state', 'iosb_localization_filter/FilterState']
      ])
    });
  }
}

