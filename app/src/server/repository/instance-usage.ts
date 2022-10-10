import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {InstanceUsage} from "../../shared/types/instance-usage";

export const findByMachineId = (id: number, callback: any) => {
    const queryString = `
    SELECT *
    FROM instance_usage as t
    WHERE t.machine_id=?`

    db.query(queryString, id, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => (x) as InstanceUsage));
    });
}
