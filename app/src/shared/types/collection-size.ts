export interface CollectionSize {
    id: number
    name: string
    size: number // number of instances per collection
}

export type CollectionSizeResponse = {
    data: CollectionSize[]
}
