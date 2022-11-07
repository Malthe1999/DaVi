import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import {
  AverageCpuUsagePerCollection,
  AverageCpuUsagePerCollectionResult,
  InstanceUsage,
} from "../../shared/types/instance-usage";

export const findByMachineId = (id: number, callback: any) => {
  const queryString = `
    SELECT *
    FROM instance_usage as t
    WHERE t.machine_id=?`;

  db.query(queryString, id, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = result as RowDataPacket;
    callback(
      null,
      rows.map((x: any) => x as InstanceUsage)
    );
  });
};

export const averageCpuUsagePerCollection = async () => {
  const queryString = `
    SELECT collection_id, SUM(average_cpu)/COUNT(*) as average_cpu
    FROM instance_usage
    GROUP BY collection_id`;

  return await dbAsync()
    .then((db) =>
      db
        .query(queryString)
        .then((res) =>
          (res[0] as RowDataPacket[]).map(
            (x: any) => x as AverageCpuUsagePerCollection
          )
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};
