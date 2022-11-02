export interface CpuUsage {
    id: string
    colid: string
    cpuusage: number 
}
export type CpuUsageResponse = {
    data: CpuUsage[]
}