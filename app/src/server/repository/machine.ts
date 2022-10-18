import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const findOne = (id: number, callback: any) => {
    const queryString = `
        SELECT *
        FROM instance_usage as iu
            JOIN machine_attributes as ma
                ON iu.machine_id = ma.machine_id
            JOIN machine_events as me
                ON iu.machine_id = me.machine_id
        WHERE iu.machine_id = ?;`

    db.query(queryString, id, (err: any, result: any) => {
        if (err) {callback(err)}
        const rows = (result as RowDataPacket);
        callback(null, rows);
    });
}
