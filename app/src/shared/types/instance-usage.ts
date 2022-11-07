export interface InstanceUsage {
  start_time: number;
  end_time: number;
  collection_id: number;
  instance_index: number;
  machine_id: number;
  alloc_collection_id: number;
  alloc_instance_index: number;
  collection_type: string;
  average_cpu: number;
  average_mem: number;
  maximum_cpu: number;
  maximum_mem: number;
  random_sample_cpu: number;
  random_sample_mem: number;
  assigned_memory: number;
  page_cache_memory: number;
  cycles_per_instruction: number;
  memory_accesses_per_instruction: number;
  sample_rate: number;
  cpu_usage_distribution: string;
  tail_cpu_usage_distribution: string;
}

export type InstanceUsageResponse = {
  data: InstanceUsage[];
};

export type AverageCpuUsagePerCollection = {
  collection_id: number;
  average_cpu: number;
};

export type AverageCpuUsagePerCollectionResult = {
  data: Array<{
    collection_id: number;
    average_cpu: number;
  }>;
};
