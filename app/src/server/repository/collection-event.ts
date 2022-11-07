import { db } from "../db";
import { RowDataPacket } from "mysql2";
import { CollectionEvent } from "../../shared/types/collection-event";

export const findByCollectionId = (id: number, callback: any) => {
  const queryString = `
    SELECT *
    FROM collection_events as t
    WHERE t.collection_id=?`;

  db.query(queryString, id, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = result as RowDataPacket;
    callback(
      null,
      rows.map((x: any) => x as CollectionEvent)
    );
  });
};
