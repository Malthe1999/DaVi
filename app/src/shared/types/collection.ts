import {CollectionEvent} from "./collection-event";
import {InstanceEvent} from "./instance-event";
import {InstanceUsage} from "./instance-usage";

export interface Collection extends CollectionEvent, InstanceEvent, InstanceUsage{

};

export type CollectionResult = {
    data: Collection[]
}
