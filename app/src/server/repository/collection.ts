import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {Collection} from "../../shared/types/collection";

export const findById = (id: number, callback: any) => {
    const queryString = `
        SELECT *
        FROM collection_events as ce
            JOIN instance_events as ie
                ON ce.collection_id = ie.collection_id
            JOIN instance_usage as iu
                ON ce.collection_id = iu.collection_id
        WHERE ce.collection_id = ?;`

    db.query(queryString, id, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => x as Collection));
    });
}
