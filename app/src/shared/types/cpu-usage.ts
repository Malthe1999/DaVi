export interface CpuUsage {
    id: string
    colid: string
    cpuusage: number 
    tempval: number 
}
export type CpuUsageResponse = {
    data: CpuUsage[]
}