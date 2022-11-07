import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import { CollectionEvent, Parent } from "../../shared/types/collection-event";

const findByCollectionId = (id: number, callback: any) => {
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

const parents = async () => {
  const queryString = `
  SELECT parent_collection_id, collection_id
  FROM collection_events
  GROUP BY parent_collection_id, collection_id`

  return await dbAsync()
    .then((db) =>
      db
        .query(queryString)
        .then((res) =>
          (res[0] as RowDataPacket[]).map(
            (x: any) => x as Parent
          )
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};

export {parents, findByCollectionId};
