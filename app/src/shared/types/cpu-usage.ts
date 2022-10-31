export interface CpuUsage {
    id: string
    colid: number
    cpuusage: number 
}
export type CpuUsageResponse = {
    data: CpuUsage[]
}