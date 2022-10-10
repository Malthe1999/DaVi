export interface CollectionEvent {
    alloc_collection_id: number
    collection_id: number
    collection_logical_name: string
    collection_name: string
    collection_type: string
    max_per_machine: number
    max_per_switch: number
    missing_type: string
    parent_collection_id: number
    priority: number
    scheduler: string
    scheduling_class: string
    start_after_collection_ids: number
    time: number
    type: string
    user: string
    vertical_scaling: string
}
