import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import {
  AverageCpuUsagePerCollection,
  AverageCpuUsagePerCollectionResult,
  InstanceUsage,
} from "../../shared/types/instance-usage";
import { ResourceUsage } from "../../shared/types/resource-usage";
import collection from "../../client/src/charts/collection";
import { HistogramUsage } from "../../shared/types/histogram-data";

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
      SELECT collection_id, machine_id, instance_index, SUM(average_cpu*(end_time - start_time)) AS resource_usage,
       CONCAT('Average CPU-usage: ', AVG(average_cpu), '<br>' , 'Average Memory-usage: ', AVG(average_mem),
       '<br>' , 'Maximum CPU-usage: ', MAX(maximum_cpu), '<br>' , 'Maximum Memory-usage: ', AVG(maximum_mem),
       '<br>' , 'Average Assigned Memory: ', AVG(assigned_memory), '<br>' , 'Sample Rate: ', AVG(sample_rate)) as information_listing
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
      SELECT collection_id, machine_id, instance_index, SUM(average_cpu*(end_time - start_time)) AS resource_usage, AVG(average_cpu) as information_listing
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
                +x["resource_usage"],
                x["information_listing"].toString()
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

export const cpuResourcesSingleInstance = async (
  collection_id?: number, 
  instance_index?: number,
  fromTime?: number,
  toTime?: number
) => {
  let queryString = "";
  queryString = `
    SELECT average_cpu AS average_cpu
    FROM instance_usage
    ${
      fromTime !== undefined && toTime !== undefined && collection_id !== undefined && instance_index !== undefined
        ? `WHERE start_time > ${fromTime} AND end_time < ${toTime} AND collection_id = ${collection_id} AND instance_index = ${instance_index}`
        : ""
    }`;

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, instance_index)
        .then((res) =>
          (res[0] as RowDataPacket[]).map(
            (x) =>
              new HistogramUsage(
                x["average_cpu"].toString()
              )
          )
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};