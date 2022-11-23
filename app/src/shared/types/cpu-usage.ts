export interface CpuUsage {
    id: string
    parent: string
    cpuusage: number 
    nodeScale: number 
    color: string
}
export type CpuUsageResponse = {
    data: CpuUsage[]
}
