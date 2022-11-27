import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import {
  AverageCpuUsagePerCollection,
  AverageCpuUsagePerCollectionResult,
  InstanceUsage,
} from "../../shared/types/instance-usage";
import { ResourceUsage } from "../../shared/types/resource-usage";

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

export const cpuResources = async (
  collection_ids: number[],
  fromTime?: number,
  toTime?: number
) => {
  let queryString = "";
  if (collection_ids.length > 0) {
    queryString = `
      SELECT collection_id, machine_id, instance_index, SUM(average_cpu*(end_time - start_time)) AS resource_usage
      FROM instance_usage
      ${
        fromTime !== undefined && toTime !== undefined
          ? `WHERE start_time > ${fromTime} AND end_time < ${toTime}`
          : ""
      }
      GROUP BY collection_id, machine_id, instance_index
      HAVING collection_id IN (
        ${Array(collection_ids.length).fill("?").join(",")}
      )`;
  } else {
    queryString = `
      SELECT collection_id, machine_id, instance_index, SUM(average_cpu*(end_time - start_time)) AS resource_usage
      FROM instance_usage
      ${
        fromTime !== undefined && toTime !== undefined
          ? `WHERE start_time > ${fromTime} AND end_time < ${toTime}`
          : ""
      }
      GROUP BY collection_id, machine_id, instance_index
      `;
  }

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, collection_ids)
        .then((res) =>
          (res[0] as RowDataPacket[]).map(
            (x) =>
              new ResourceUsage(
                x["collection_id"].toString(),
                x["machine_id"].toString(),
                x["instance_index"].toString(),
                +x["resource_usage"]
              )
          )
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};

export const memoryResources = async (
  collection_ids: number[],
  fromTime?: number,
  toTime?: number
) => {
  let queryString = "";
  if (collection_ids.length > 0) {
    queryString = `
      SELECT collection_id, machine_id, instance_index, SUM(average_mem*(end_time - start_time)) AS resource_usage
      FROM instance_usage
      ${
        fromTime !== undefined && toTime !== undefined
          ? `WHERE start_time > ${fromTime} AND end_time < ${toTime}`
          : ""
      }
      GROUP BY collection_id, machine_id, instance_index
      HAVING collection_id IN (
        ${Array(collection_ids.length).fill("?").join(",")}
      )`;
  } else {
    queryString = `
      SELECT collection_id, machine_id, instance_index, SUM(average_mem*(end_time - start_time)) AS resource_usage
      FROM instance_usage
      ${
        fromTime !== undefined && toTime !== undefined
          ? `WHERE start_time > ${fromTime} AND end_time < ${toTime}`
          : ""
      }
      GROUP BY collection_id, machine_id, instance_index
      `;
  }

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, collection_ids)
        .then((res) =>
          (res[0] as RowDataPacket[]).map((x) => x as ResourceUsage)
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};
