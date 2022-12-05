import {
  CollectionEvent,
  CollectionEventResponse,
  CollectionId,
  Parent,
} from "../../../shared/types/collection-event";
import {
  InstanceEvent,
  InstanceEventResponse,
  RequestedInstanceResources,
} from "../../../shared/types/instance-event";
import {
  AverageCpuUsagePerCollectionResult,
  InstanceUsageResponse,
} from "../../../shared/types/instance-usage";
import { MachineAttributesResponse } from "../../../shared/types/machine-attributes";
import {
  MachineEvent,
  MachineEventResponse,
} from "../../../shared/types/machine-event";
import { MachineResult } from "../../../shared/types/machine";
import { CollectionResult } from "../../../shared/types/collection";
import { CollectionSizeResponse } from "../../../shared/types/collection-size";
import { CpuUsage, CpuUsageResponse } from "../../../shared/types/cpu-usage";
import { CollectionSpreadResponse } from "../../../shared/types/collection-spread";
import { ResourceUsage } from "../../../shared/types/resource-usage";
import { HistogramUsage } from "../../../shared/types/histogram-data";

export const getData = async <T>(resource: string): Promise<T> => {
  const res = await fetch(`http://localhost:17500/api/${resource}`, {
    method: "Get",
    headers: {
      "Content-type": "application/json",
    },
  });

  return await res.json();
};

export const collectionEventByCollectionId = async (
  id: number
): Promise<CollectionEventResponse> => {
  return getData<any>("/collection-event/collection/" + id);
};

export const instanceEventByCollectionId = async (
  id: number
): Promise<InstanceEventResponse> => {
  return getData<any>("/instance-event/collection/" + id);
};

export const instanceEventByMachineId = async (
  id: number
): Promise<InstanceEventResponse> => {
  return getData<any>("/instance-event/machine/" + id);
};

export const instanceUsageByMachineId = async (
  id: number
): Promise<InstanceUsageResponse> => {
  return getData<any>("/instance-usage/machine/" + id);
};

export const machineEventByMachineId = async (
  id: number
): Promise<MachineEventResponse> => {
  return getData<any>("/machine-event/machine/" + id);
};

export const machineAttributesByMachineId = async (
  id: number
): Promise<MachineAttributesResponse> => {
  return getData<any>("/machine-attributes/machine/" + id);
};

export const machineById = async (id: number): Promise<MachineResult> => {
  return getData<any>("/machine/" + id);
};

export const collectionById = async (id: number): Promise<CollectionResult> => {
  return getData<any>("/collection/" + id);
};

export const allCollectionSizes = async (): Promise<CollectionSizeResponse> => {
  return getData<any>("/collection-size/all");
};
export const allCpuUsage = async (): Promise<CpuUsageResponse> => {
  return getData<CpuUsageResponse>("/cpu-usage/all");
};
export const allCollectionSpread =
  async (): Promise<CollectionSpreadResponse> => {
    return getData<any>("/collection-spread/all");
  };

export const averageCpuUsagePerCollection =
  async (): Promise<AverageCpuUsagePerCollectionResult> => {
    return getData<any>("average-cpu-per-collection");
  };

export const requestedInstanceResources = async (collection_ids: number[]) => {
  return getData<any>(
    "requested-instance-resources/" + collection_ids.join(",")
  )
    .then((res) => res.data as Array<RequestedInstanceResources>)
    .catch((err) => err as Error);
};

export const collectionParents = async (collection_ids?: number[]) => {
  return getData<{ data: Parent[] }>(
    "collection-parents/" + (collection_ids ? collection_ids.join(",") : "")
  )
    .then((res) => Promise.resolve(res.data as Parent[]))
    .catch((err) => Promise.reject(err as Error));
};

export const uniqueCollectionIds = async () => {
  return getData<any>("unique-collection-ids")
    .then((res) => res.data as Array<CollectionId>)
    .catch((err) => err as Error);
};

export const cpuResources = async (
  collection_ids?: (number | string)[],
  fromTime?: number,
  toTime?: number
) => {
  return getData<{ data: ResourceUsage[] }>(
    "cpu-resources/" +
      (collection_ids ? collection_ids.join(",") : "") +
      "/" +
      fromTime +
      "/" +
      toTime
  )
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err as Error));
};

export const memoryResources = async (
  collection_ids?: (number | string)[],
  fromTime?: number,
  toTime?: number
) => {
  return getData<{ data: ResourceUsage[] }>(
    "memory-resources/" +
      (collection_ids ? collection_ids.join(",") : "") +
      "/" +
      fromTime +
      "/" +
      toTime
  )
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err as Error));
};

export const cpuHistogram = async (
  collection_id?: number | string,
  instance_index?: number,
  fromTime?: number,
  toTime?: number
) => {
  return getData<{ data: HistogramUsage[] }>(
    "histogram-cpu/" +
      collection_id +
      "/" +
      instance_index +
      "/" +
      fromTime +
      "/" +
      toTime
  )
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err as Error));
};

export const getCollectionEvents = async (ids: (number | string)[]) => {
  if (ids.length === 0) {
    return [];
  }
  return getData<{ data: CollectionEvent[] }>(
    "collection-events/" + (ids ? ids.join(",") : "")
  )
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err as Error));
};

export const getMachineEvents = async (ids: (number | string)[]) => {
  if (ids.length === 0) {
    return [];
  }
  return getData<{ data: MachineEvent[] }>(
    "machine-events/" + (ids ? ids.join(",") : "")
  )
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err as Error));
};

export const getInstanceEvents = async (
  collection_ids: (number | string)[],
  machine_ids: (number | string)[],
  ids: (number | string)[]
) => {
  if (ids.length === 0) {
    return [];
  }
  return getData<{ data: InstanceEvent[] }>(
    "instance-events/" +
      (collection_ids ? collection_ids.join(",") : "") +
      "/" +
      (machine_ids ? machine_ids.join(",") : "") +
      "/" +
      (ids ? ids.join(",") : "") +
      "/"
  )
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err as Error));
};

export const getCollectionAttributes = async () => {

  return getData<{ data: string[] }>( // TODO proper type
    "collection-attributes/" // TODO
  )
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err as Error));
};
