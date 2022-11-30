import { MachineEvent } from "../../shared/types/machine-event";
import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";

export const findByMachineId = (id: number, callback: any) => {
  const queryString = `
    SELECT *
    FROM machine_events as t
    WHERE t.machine_id=?`;

  db.query(queryString, id, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = result as RowDataPacket;
    callback(
      null,
      rows.map((x: any) => x as MachineEvent)
    );
  });
};

export const machineEvents = async (ids: number[]) => {
  const queryString = `
    SELECT *
    FROM machine_events
    WHERE machine_id IN (${Array(ids.length)
      .fill("?")
      .join(",")})`;

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, ids)
        .then((res) =>
          (res[0] as RowDataPacket[]).map((x: any) => x as MachineEvent)
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};
