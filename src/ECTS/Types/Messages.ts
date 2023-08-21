import { ServiceResponse } from 'roslib';
import export_default from 'unplugin-icons/dist/nuxt.js';

export namespace std_msgs {
  export type Float32 = {
    data: number;
  };

  export type UInt32 = {
    data: number;
  };

  export type Bool = {
    data: boolean;
  };
}

export namespace ects_msgs {
  export type ForceRetrasmit = {
    reload_all: boolean;
    topic: string;
  };

  export type ECTSStatus_srv = {
    version: string;
    plugins_loaded: string[];
    robot_name: string;
  };

  export type AdapterList = {
    adapters: string[];
  };

  export type AggregationList = {
    available_aggregations: Aggregation[];
  };

  export type Aggregation = {
    ectsname: string;
    type: typeof Aggregation.Type;
    interval: number;
    nreadings: number;
    keep_amount: number;
  };
  export namespace Aggregation {
    export namespace Type {
      export const TYPE_INTERVAL = 0,
        TYPE_READINGS = 1;
    }
  }
  export type CpuUsage = {
    total_usage: number;
    per_core_usage: number[];
    load_averages: number[];
  };
  export type CpuUsageHistory = {
    aggregation: Aggregation;
    measurements: CpuUsage[];
  };
  export type MemoryUsage = {
    used: number;
    total: number;
    free: number;
    shared: number;
    buff_cache: number;
    available: number;
  };

  export type MemoryUsageHistory = {
    aggregation: Aggregation;
    measurements: MemoryUsage[];
  };

  export type NetworkUsage = {
    down_speed: number;
    up_speed: number;
    wifi_signal_strength: number;
  };

  export type NetworkInfo = {
    interface_name: string;
    human_readable_ip_address: string;
    default_gateway: string;
    dns_addresses: string;
    link_is_up: boolean;
    wlan_ssid: string;
  };

  export type NetworkUsageHistory = {
    aggregation: Aggregation;
    measurements: NetworkUsage[];
  };

  export type DiskUsage = {
    size_total: number;
    used: number;
  };

  export type DiskUsageHistory = {
    aggregation: Aggregation;
    measurements: DiskUsage[];
  };

  export type MountpointList = {
    rosname: string[];
    mountpoint: string[];
  };

  export type Position2d = {
    x: number;
    y: number;
    radius: number;
  };

  export type Heading = {
    heading: number;
    accuracy: number;
  };

  export type WaypointBUG = {
    name: string;
    position: Position2d;
    heading: Heading;
    wait_time: number;
  };

  export type Waypoint = iosb_nav_msgs.Waypoint & {
    name: string;
  };

  export type AddWaypoint = {
    waypoint: Waypoint;
    index: number;
  };

  export type RemoveWaypoint = {
    index: number;
  };

  export type ReplaceWaypoint = {
    index_to_replace: number;
    replacement_waypoint: Waypoint;
  };

  export type ReorderWaypoints = {
    new_indices: number[];
  };

  export type WaypointList = {
    name: string;
    waypoints: ects_msgs.Waypoint[];
    total_length: number;
    cyclic: boolean;
  };
  export type WaypointListDirectory = {
    filenames: string[];
    success: boolean;
    error_message: string;
  };
}

export namespace iosb_localization_filter {
  export type FilterState = {
    P: number[];
    euler_angles: number[];
    pos: number[];
    vel: number[];
    bias_acc: number[];
    bias_omega: number[];
    scale_factor_vel_odo: number[];
    driving_mode: number;
    gps_active: boolean;
    fog_active: boolean;
    odo_vel_active: boolean[];
    delta_3d_active: boolean[];
    delta_2d_active: boolean[];
    twist_active: boolean;
    loc_in_map_active: boolean;
    heading_estimator_active: boolean;
    obtained_init_data: boolean;
    obtained_gps: boolean;
    obtained_loc_in_map: boolean;
  };
}
export namespace sensor_msgs {
  export type BatteryState = {
    voltage: number;
    current: number;
    charge: number;
    capacity: number;
    design_capacity: number;
    percentage: number;
    power_supply_status: number;
    power_supply_health: number;
    power_supply_technology: number;
  };

  export type Imu = {
    orientation: geometry_msgs.Quaternion;
    orientation_covariance: number[];
    angular_velocity: geometry_msgs.Vector3;
    angular_velocity_covariance: number[];
    linear_acceleration: geometry_msgs.Vector3;
    linear_acceleration_covariance: number[];
  };

  export const POWER_SUPPLY_STATUS_UNKNOWN = 0,
    POWER_SUPPLY_STATUS_CHARGING = 1,
    POWER_SUPPLY_STATUS_DISCHARGING = 2,
    POWER_SUPPLY_STATUS_NOT_CHARGING = 3,
    POWER_SUPPLY_STATUS_FULL = 4,
    POWER_SUPPLY_HEALTH_UNKNOWN = 0,
    POWER_SUPPLY_HEALTH_GOOD = 1,
    POWER_SUPPLY_HEALTH_OVERHEAT = 2,
    POWER_SUPPLY_HEALTH_DEAD = 3,
    POWER_SUPPLY_HEALTH_OVERVOLTAGE = 4,
    POWER_SUPPLY_HEALTH_UNSPEC_FAILURE = 5,
    POWER_SUPPLY_HEALTH_COLD = 6,
    POWER_SUPPLY_HEALTH_WATCHDOG_TIMER_EXPIRE = 7,
    POWER_SUPPLY_HEALTH_SAFETY_TIMER_EXPIRE = 8,
    POWER_SUPPLY_TECHNOLOGY_UNKNOWN = 0,
    POWER_SUPPLY_TECHNOLOGY_NIMH = 1,
    POWER_SUPPLY_TECHNOLOGY_LION = 2,
    POWER_SUPPLY_TECHNOLOGY_LIPO = 3,
    POWER_SUPPLY_TECHNOLOGY_LIFE = 4,
    POWER_SUPPLY_TECHNOLOGY_NICD = 5,
    POWER_SUPPLY_TECHNOLOGY_LIMN = 6;
}
export namespace iosb_nav_msgs {
  export type Waypoint = {
    pose: geometry_msgs.Pose2D;
    radius: number;
    heading_accuracy: number;
    use_heading: boolean;
    wait_time: number;
  };
}

export namespace nav_msgs {
  export type Odometry = {
    child_frame_id: string;
    pose: geometry_msgs.PoseWithCovariance;
    twist: geometry_msgs.TwistWithCovariance;
  };
}

export namespace geometry_msgs {
  export type Pose = {
    position: Point;
    orientation: Quaternion;
  };

  export type Point = {
    x: number;
    y: number;
    z: number;
  };

  export type Quaternion = {
    x: number;
    y: number;
    z: number;
    w: number;
  };

  export type Pose2D = {
    x: number;
    y: number;
    theta: number;
  };

  export type Vector3 = {
    x: number;
    y: number;
    z: number;
  };

  export type PoseWithCovariance = {
    pose: Pose;
    /** 6x6 matrix (x, y, z, rotation about X axis, rotation about Y axis, rotation about Z axis) */
    covariance: number[];
  };

  export type Twist = {
    linear: Vector3;
    angular: Vector3;
  };

  export type TwistWithCovariance = {
    twist: Twist;
    /** 6x6 matrix (x, y, z, rotation about X axis, rotation about Y axis, rotation about Z axis) */
    covariance: number[][];
  };
}
