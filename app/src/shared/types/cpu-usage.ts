export interface CpuUsage {
    id: number
    name: string
    size: number // number of instances per collection
}
export type CpuUsageResponse = {
    data: CpuUsage[]
}