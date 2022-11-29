import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import {
  InstanceEvent,
  RequestedInstanceResources,
} from "../../shared/types/instance-event";

export const findByMachineId = (id: number, callback: any) => {
  const queryString = `
    SELECT *
    FROM instance_events as t
    WHERE t.machine_id=?`;

  db.query(queryString, id, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = result as RowDataPacket;
    callback(
      null,
      rows.map((x: any) => x as InstanceEvent)
    );
  });
};

export const findByCollectionId = (id: number, callback: any) => {
  const queryString = `
    SELECT *
    FROM instance_events as t
    WHERE t.collection_id=?`;

  db.query(queryString, id, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = result as RowDataPacket;
    callback(
      null,
      rows.map((x: any) => x as InstanceEvent)
    );
  });
};

const requestedInstances = async (collection_ids: number[]) => {
  let queryString = "";
  if (collection_ids) {
    queryString = `
      SELECT collection_id, machine_id, instance_index, avg(requested_cpu) as requested_cpu, avg(requested_mem) as requested_mem
      FROM instance_events
      GROUP BY collection_id, machine_id, instance_index
      HAVING collection_id IN (${Array(collection_ids.length)
        .fill("?")
        .join(",")})`;
  } else {
    queryString = `
      SELECT collection_id, machine_id, instance_index, avg(requested_cpu) as requested_cpu, avg(requested_mem) as requested_mem
      FROM instance_events
      GROUP BY collection_id, machine_id, instance_index`;
  }

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, collection_ids)
        .then((res) =>
          (res[0] as RowDataPacket[]).map(
            (x) => x as RequestedInstanceResources
          )
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};

export { requestedInstances };

export const instanceEvents = async (ids: number[], machine_ids: number[], collection_ids: number[]) => {
  const queryString = `
    SELECT *
    FROM instance_events
    WHERE instance_index IN (${Array(ids.length)
      .fill("?")
      .join(",")})
      AND collection_id IN (${Array(collection_ids.length)
      .fill("?")
      .join(",")})
      AND machine_id IN (${Array(machine_ids.length)
      .fill("?")
      .join(",")})
      `;

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, ids)
        .then((res) =>
          (res[0] as RowDataPacket[]).map((x: any) => x as InstanceEvent)
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};
