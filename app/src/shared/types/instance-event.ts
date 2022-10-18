export interface InstanceEvent {
    time: number
    type: string
    collection_id: number
    scheduling_class: string
    missing_type: string
    collection_type: string
    priority: number
    alloc_collection_id: number
    instance_index: number
    machine_id: number
    alloc_instance_index: number
    requested_cpu: number
    requested_mem: number
    constraints: string
}

export type InstanceEventResponse = {
    data: InstanceEvent[]
}
