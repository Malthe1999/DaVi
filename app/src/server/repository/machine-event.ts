import {MachineEvent} from "../../shared/types/machine-event";
import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const findByMachineId = (id: number, callback: any) => {
    const queryString = `
    SELECT *
    FROM machine_events as t
    WHERE t.machine_id=?`

    db.query(queryString, id, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => x as MachineEvent));
    });
}
