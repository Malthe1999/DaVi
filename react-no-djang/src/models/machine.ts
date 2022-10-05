import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const findOne = (id: number, callback: Function) => {
    const queryString = `
        SELECT *
        FROM instance_usage as iu
            JOIN machine_attributes as ma
                ON iu.machine_id = ma.machine_id
            JOIN machine_events as me
                ON iu.machine_id = me.machine_id
        WHERE iu.machine_id = ?;`

        // Break this into different objects

    db.query(queryString, id, (err, result) => {
        if (err) {callback(err)}
        let rows = (<RowDataPacket>result);
        callback(null, rows);
    });
}
