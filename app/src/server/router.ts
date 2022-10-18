import express, {Request, Response} from "express";
import * as CollectionEventRepo from './repository/collection-event';
import * as InstanceEventRepo from './repository/instance-event';
import * as InstanceUsageRepo from './repository/instance-usage';
import * as MachineAttributeRepo from './repository/machine-attribute';
import * as MachineEventRepo from './repository/machine-event';
import {CollectionEvent} from '../shared/types/collection-event';
import {InstanceEvent} from "../shared/types/instance-event";
import {InstanceUsage} from "../shared/types/instance-usage";
import {MachineAttributes} from "../shared/types/machine-attributes";
import {MachineEvent} from "../shared/types/machine-event";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send('Ok')
});

router.get("/collection-event/collection/:id", async (req: Request, res: Response) => {
  CollectionEventRepo.findByCollectionId(+req.params['id'] , (err: Error, result: CollectionEvent[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({data: result});
  });
});

router.get("/instance-event/collection/:id", async (req: Request, res: Response) => {
  InstanceEventRepo.findByCollectionId(+req.params['id'] , (err: Error, result: InstanceEvent[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({data: result});
  });
});

router.get("/instance-event/machine/:id", async (req: Request, res: Response) => {
  InstanceEventRepo.findByMachineId(+req.params['id'] , (err: Error, result: InstanceEvent[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({data: result});
  });
});

router.get("/instance-usage/machine/:id", async (req: Request, res: Response) => {
  InstanceUsageRepo.findByMachineId(+req.params['id'] , (err: Error, result: InstanceUsage[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({data: result});
  });
});

router.get("/machine-attribute/machine/:id", async (req: Request, res: Response) => {
  MachineAttributeRepo.findByMachineId(+req.params['id'] , (err: Error, result: MachineAttributes[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({data: result});
  });
});

router.get("/machine-event/machine/:id", async (req: Request, res: Response) => {
  MachineEventRepo.findByMachineId(+req.params['id'] , (err: Error, result: MachineEvent[]) => {
    if (err) {
      return res.status(500).json({"errorMessage": err.message});
    }

    res.status(200).json({data: result});
  });
});

export {router};
