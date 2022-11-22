export interface CollectionSpread {
    id: string
    cpuusageTotal: number
}
export type CollectionSpreadResponse = {
    data: CollectionSpread[]
}