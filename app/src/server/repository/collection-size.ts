import { db } from "../db";
import { RowDataPacket } from "mysql2";
import { CollectionSize } from "../../shared/types/collection-size";

export const allCollectionSizes = (callback: any) => {
  const queryString = `
    SELECT ie.collection_id as id, collection_name as name, count(distinct instance_index, machine_id) as size
    FROM instance_events as ie
        JOIN collection_events as ce
        ON ie.collection_id = ce.collection_id
    GROUP BY ie.collection_id`;

  db.query(queryString, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = result as RowDataPacket;
    callback(
      null,
      rows.map((x: any) => x as CollectionSize)
    );
  });
};
