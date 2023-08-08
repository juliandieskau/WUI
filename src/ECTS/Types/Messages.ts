import { ServiceResponse } from "roslib";
import export_default from "unplugin-icons/dist/nuxt.js";

export namespace std_msgs {
    export type Float32 = {
        data: number;
    }

    export type Bool = {
        data: boolean;
    }
}

export namespace ects_msgs {
    export type ForceRetrasmit = {
        reload_all: boolean,
        topic: string,
    }

    export type ECTSStatus_srv = {
        version: string,
        plugins_loaded: string[],
        robot_name: string,
    }

    export type AdapterList = {
        adapters: string[],
    }

    export type AggregationList = {
        available_aggregations: Aggregation[],
    }

    export type Aggregation = {
        ectsname: string,
        type: typeof Aggregation.Type,
        interval: number,
        nreadings: number,
        keep_amount: number,
    }
    export namespace Aggregation {
        export namespace Type {
            export const TYPE_INTERVAL = 0, TYPE_READINGS = 1;
        }
    }
    export type CpuUsage = {
        total_usage: number,
        per_core_usage: number[],
        load_averages: number[]
    }
    export type CpuUsageHistory = {
        aggregation: Aggregation,
        measurements: CpuUsage[],
    }
    export type MemoryUsage = {
        used: number,
        total: number,
        free: number,
        shared: number,
        buff_cache: number,
        available: number,
    }

    export type MemoryUsageHistory = {
        aggregation: Aggregation,
        measurements: MemoryUsage[],
    }

    export type NetworkUsage = {
        down_speed: number,
        up_speed: number,
        wifi_signal_strength: number,
    }

    export type NetworkUsageHistory = {
        aggregation: Aggregation,
        measurements: NetworkUsage[],
    }

    export type Position2d = {
        x: number,
        y: number,
        radius: number,
    }

    export type Heading = {
        heading: number,
        accuracy: number,
    }

    export type WaypointBUG = {
        name: string,
        position: Position2d,
        heading: Heading,
        wait_time: number,
    }

    export type Waypoint = iosb_nav_msgs.Waypoint & {
        name: string
    }

    export type AddWaypoint = {
        waypoint: Waypoint,
        index: number,
    }

    export type RemoveWaypoint = {
        index: number,
    }

    export type ReplaceWaypoint = {
        index_to_replace: number,
        replacement_waypoint: Waypoint,
    }

    export type WaypointList = {
        name: string,
        waypoints: ects_msgs.Waypoint[],
    }
    export type WaypointListDirectory = {
        filenames: string[],
        success: boolean,
        error_message: string,
    }

}

export namespace sensor_msgs {
    export type BatteryState = {
        voltage: number
        current: number
        charge: number
        capacity: number
        design_capacity: number
        percentage: number
        power_supply_status: number
        power_supply_health: number
        power_supply_technology: number
    }

    export const
        POWER_SUPPLY_STATUS_UNKNOWN = 0,
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
        pose: geometry_msgs.Pose2D,
        radius: number,
        heading_accuracy: number,
        use_heading: boolean,
        wait_time: number,
    }
}

export namespace nav_msgs {
    export type Odometry = {
        child_frame_id: string,
        pose: geometry_msgs.PoseWithCovariance,
        twist: geometry_msgs.TwistWithCovariance,
    }
}

export namespace geometry_msgs {
    export type Pose = {
        position: Point,
        orientation: Quaternion,
    }

    export type Point = {
        x: number,
        y: number,
        z: number,
    }

    export type Quaternion = {
        x: number,
        y: number,
        z: number,
        w: number,
    }

    export type Pose2D = {
        x: number,
        y: number,
        theta: number,
    }

    export type PoseWithCovariance = {
        pose: Pose,
        /** 6x6 matrix (x, y, z, rotation about X axis, rotation about Y axis, rotation about Z axis) */
        covariance: number[][],
    }

    export type Twist = {
        linear: { x: number, y: number, z: number },
        angular: { x: number, y: number, z: number }
    }

    export type TwistWithCovariance = {
        twist: Twist,
        /** 6x6 matrix (x, y, z, rotation about X axis, rotation about Y axis, rotation about Z axis) */
        covariance: number[][],
    }
}