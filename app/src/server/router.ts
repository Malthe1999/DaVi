import express, {Request, Response} from "express";
import * as CollectionEventRepo from './repository/collection-events';
import {CollectionEvent} from '../shared/types/collection-event';

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send('Ok')
});

router.get("/collection-event", async (req: Request, res: Response) => {
  CollectionEventRepo.findByCollectionId(400133700345, (err: Error, result: CollectionEvent[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({"data": result});
  });
});

export {router};
