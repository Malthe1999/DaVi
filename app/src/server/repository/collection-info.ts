import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import { CollectionEvent, Parent } from "../../shared/types/collection-event";
import { CollectionInfo } from "../../shared/types/collection-info";

export const findCollectionInfo = async() => {
  const queryString = `
    SELECT AVG(priority) as priority, collection_id as id
    FROM collection_events 
    GROUP BY collection_id`;

    return await dbAsync()
    .then((db) =>
      db
        .query(queryString)
        .then((res) =>
          (res[0] as RowDataPacket[]).map(
            (x: any) => x as CollectionInfo
          )
        )
        .catch((err) => err)
    )
    .catch((err) => err);
};
