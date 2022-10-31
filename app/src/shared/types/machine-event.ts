export interface MachineEvent {
    capacity_cpu: number
    capacity_mem: number
    machine_event: string
    machine_id: number
    missing_data_reason: string
    platform_id: string
    switch_id: string
    time: number
}

export type MachineEventResponse = {
    data: MachineEvent[]
}
