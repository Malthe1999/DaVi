import {InstanceEvent} from "./instance-event";
import {InstanceUsage} from "./instance-usage";
import {MachineAttributes} from "./machine-attributes";
import {MachineEvent} from "./machine-event";

export interface Machine extends InstanceEvent, InstanceUsage, MachineAttributes, MachineEvent{

};

export type MachineResult = {
    table: Machine[]
}
