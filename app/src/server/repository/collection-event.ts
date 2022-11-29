import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import { CollectionEvent, Parent } from "../../shared/types/collection-event";

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

export const parents = async (collection_ids: number[]) => {
  let queryString = "";
  if (collection_ids.length) {
    queryString = `
      SELECT parent_collection_id, collection_id
      FROM collection_events
      GROUP BY parent_collection_id, collection_id
      HAVING collection_id IN (${Array(collection_ids.length)
        .fill("?")
        .join(",")})`;
  } else {
    queryString = `
      SELECT parent_collection_id, collection_id
      FROM collection_events
      GROUP BY parent_collection_id, collection_id`;
  }

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, collection_ids)
        .then((res) => (res[0] as RowDataPacket[]).map((x: any) => x as Parent))
        .catch((err) => err)
    )
    .catch((err) => err);
};

export const uniqueCollectionIds = async () => {
  const queryString = `
    SELECT UNIQUE(collection_id)
    FROM collection_events`;

  return dbAsync()
    .then((db) =>
      db
        .query(queryString)
        .then((res) => (res[0] as RowDataPacket[]).map((x: any) => x as Parent))
        .catch((err) => err)
    )
    .catch((err) => err);
};

export const collectionEvents = async (ids: number[]) => {
  const queryString = `
    SELECT *
    FROM collection_events
    WHERE collection_id IN (${Array(ids.length)
      .fill("?")
      .join(",")})`;

  return dbAsync()
    .then((db) =>
      db
        .query(queryString, ids)
        .then((res) =>
          (res[0] as RowDataPacket[]).map((x: any) => x as CollectionEvent)
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};
