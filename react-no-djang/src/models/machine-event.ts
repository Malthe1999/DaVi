export {}/*import {MachineEvent} from "../types/machine-event";
import {db} from "../../../database-example/db";
import {RowDataPacket} from "mysql2";

export const findOne = (id: number, callback: Function) => {
    const queryString = `
    SELECT *
    FROM machine_events as me
    WHERE me.machine_id=?`

    db.query(queryString, id, (err, result) => {
        if (err) {callback(err)}

        const row = (<RowDataPacket>result)[0];
        const machineEvent: MachineEvent = {
            capacity_cpu: row.capacity_cpu,
            capacity_mem: row.capacity_mem,
            machine_event: row.machine_event,
            machine_id: row.machine_id,
            missing_data_reason: row.missing_data_reason,
            platform_id: row.platform_id,
            switch_id: row.switch_id,
            time: row.time,
        }
        callback(null, machineEvent);
    });
}*/
