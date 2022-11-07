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

const requestedInstances = async () => {
  const queryString = `
    SELECT collection_id, machine_id, instance_index, avg(requested_cpu) as requested_cpu, avg(requested_mem) as requested_mem
    FROM instance_events
    GROUP BY collection_id, machine_id, instance_index`;

  return await dbAsync()
    .then((db) =>
      db
        .query(queryString)
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
