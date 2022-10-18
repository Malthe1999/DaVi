export interface MachineAttributes {
    time: number
    machine_id: number
    name: string
    value: string
    deleted: number
}

export type MachineAttributesResponse = {
    table: MachineAttributes[]
}
