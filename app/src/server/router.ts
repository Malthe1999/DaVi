import express, {Request, Response} from "express";
import * as CollectionEventRepo from './repository/collection-events';
import {CollectionEvent} from '../shared/types/collection-event';

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send('Ok')
});

// 400133700345

router.get("/collection-event/:id", async (req: Request, res: Response) => {
  CollectionEventRepo.findByCollectionId(+req.params['id'] , (err: Error, result: CollectionEvent[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({"data": result});
  });
});

export {router};
