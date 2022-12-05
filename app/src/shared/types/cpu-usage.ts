export interface CpuUsage {
    id: string
    parent: string
    cpuusage: number 
    nodeScale: number 
    color: string
    informationListing: string[]
}

export type CpuUsageResponse = {
    data: CpuUsage[]
}
