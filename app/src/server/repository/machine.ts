import { db } from "../db";
import { RowDataPacket } from "mysql2";

export const findById = (id: number, callback: any) => {
  const queryString = `
        SELECT *
        FROM instance_events as ie
            JOIN instance_usage as iu
                ON ie.machine_id = iu.machine_id
            JOIN machine_attributes as ma
                ON ie.machine_id = ma.machine_id
            JOIN machine_events as me
                ON ie.machine_id = me.machine_id
        WHERE ie.machine_id = ?;`;

  db.query(queryString, id, (err, result) => {
    if (err) {
      callback(err);
    }
    const rows = result as RowDataPacket;
    callback(null, rows);
  });
};
