import {db} from "../db";
import {RowDataPacket} from "mysql2";
import { CpuUsage } from "../../shared/types/cpu-usage";

export const allCpuUsage = (callback: any) => {
    const queryString = `
    SELECT CONCAT(iu.collection_id, iu.start_time, iu.instance_index) as id,
     iu.collection_id as colid, iu.average_cpu as cpuusage 
     FROM instance_usage as iu`

    db.query(queryString, (err, result) => {
        if (err) {callback(err)}

        const rows = (result as RowDataPacket);
        callback(null, rows.map((x: any) => x as CpuUsage));
    });
}
