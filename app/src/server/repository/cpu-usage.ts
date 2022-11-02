import {db} from "../db";
import {RowDataPacket} from "mysql2";
import { CpuUsage } from "../../shared/types/cpu-usage";
import { CollectionSpread } from "../../shared/types/collection-spread";

export const allCpuUsage = (callback: any) => {
    const queryString = `
    SELECT CONCAT(iu.collection_id, iu.instance_index) as id,
     iu.collection_id as colid, SUM(iu.average_cpu) as cpuusage 
     FROM instance_usage as iu
     GROUP BY iu.collection_id, iu.instance_index`
    db.query(queryString, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => x as CpuUsage));
    });
}
export const allCollectionSpread = (callback: any) => {
    const queryString = `
    SELECT DISTINCT ce.collection_id as id
    FROM collection_events as ce`

    db.query(queryString, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => x as CollectionSpread));
    });
}
