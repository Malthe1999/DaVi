import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {InstanceEvent} from "../../shared/types/instance-event";

export const findByMachineId = (id: number, callback: any) => {
    const queryString = `
    SELECT *
    FROM instance_events as t
    WHERE t.machine_id=?`

    db.query(queryString, id, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => x as InstanceEvent));
    });
}

export const findByCollectionId = (id: number, callback: any) => {
    const queryString = `
    SELECT *
    FROM instance_events as t
    WHERE t.collection_id=?`

    db.query(queryString, id, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => x as InstanceEvent));
    });
}
