import {CollectionEventResponse} from '../../../shared/types/collection-event';
import {InstanceEventResponse} from '../../../shared/types/instance-event';
import {InstanceUsageResponse} from '../../../shared/types/instance-usage';
import {MachineAttributesResponse} from '../../../shared/types/machine-attributes';
import {MachineEventResponse} from '../../../shared/types/machine-event';
import {MachineResult} from '../../../shared/types/machine';
import {CollectionResult} from '../../../shared/types/collection';

export const getData = async<T>(resource: string) : Promise<T> => {
    const res = await fetch(`http://localhost:17500/api/${resource}`, {
        method: 'Get',
        headers: {
            'Content-type': 'application/json'
        },
    });

    return await res.json();
}

export const collectionEventByCollectionId = async (id: number): Promise<CollectionEventResponse> => {
    return getData<any>('/collection-event/collection/' + id)
}

export const instanceEventByCollectionId = async (id: number): Promise<InstanceEventResponse> => {
    return getData<any>('/instance-event/collection/' + id)
}

export const instanceEventByMachineId = async (id: number): Promise<InstanceEventResponse> => {
    return getData<any>('/instance-event/machine/' + id)
}

export const instanceUsageByMachineId = async (id: number): Promise<InstanceUsageResponse> => {
    return getData<any>('/instance-usage/machine/' + id)
}

export const machineEventByMachineId = async (id: number): Promise<MachineEventResponse> => {
    return getData<any>('/machine-event/machine/' + id)
}

export const machineAttributesByMachineId = async (id: number): Promise<MachineAttributesResponse> => {
    return getData<any>('/machine-attributes/machine/' + id)
}

export const machineById = async (id: number): Promise<MachineResult> => {
    return getData<any>('/machine/' + id)
}

export const collectionById = async (id: number): Promise<CollectionResult> => {
    return getData<any>('/collection/' + id)
}
