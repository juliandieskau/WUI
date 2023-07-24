export namespace std_msgs {
    export type Float32 = {
        data: number;
    }

    export type Bool = {
        data: boolean;
    }
}

export namespace ects_msgs {
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
        averaging_duration: number,
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


