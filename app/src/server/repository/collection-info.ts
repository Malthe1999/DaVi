import { db, dbAsync } from "../db";
import { RowDataPacket } from "mysql2";
import { CollectionEvent, Parent } from "../../shared/types/collection-event";
import { CollectionInfo } from "../../shared/types/collection-info";

export const findCollectionInfo = async() => {
  const queryString = `
    SELECT collection_id as id,
    CONCAT('Priority rating: ', priority, '<br>' , 'Vertical scaling: ', vertical_scaling,
        '<br>' , 'Scheduling class: ', scheduling_class) as information_listing
    FROM collection_events`;

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
