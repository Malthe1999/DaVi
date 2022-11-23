export interface CpuUsage {
    id: string
    colid: string
    cpuusage: number 
    tempval: number 
    color: string
}
export type CpuUsageResponse = {
    data: CpuUsage[]
}