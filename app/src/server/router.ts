import express, { Request, Response } from "express";
import {
  instanceEvents,
  requestedInstances,
} from "./repository/instance-event";
import * as MachineAttributeRepo from "./repository/machine-attribute";
import * as CollectionRepo from "./repository/collection";
import * as MachineRepo from "./repository/machine";
import * as CollectionSizeRepo from "./repository/collection-size";
import * as CpuUsageRepo from "./repository/cpu-usage";
import { InstanceUsage } from "../shared/types/instance-usage";
import { MachineAttributes } from "../shared/types/machine-attributes";
import { MachineEvent } from "../shared/types/machine-event";
import { Collection } from "../shared/types/collection";
import { Machine } from "../shared/types/machine";
import { CollectionSize } from "../shared/types/collection-size";
import { CpuUsage } from "../shared/types/cpu-usage";
import { CollectionSpread } from "../shared/types/collection-spread";
import {
  collectionEvents,
  findByCollectionId,
  parents,
  uniqueCollectionIds,
} from "./repository/collection-event";
import {
  averageCpuUsagePerCollection,
  cpuResources,
  cpuResourcesSingleInstance,
  findByMachineId,
  memoryResources,
} from "./repository/instance-usage";
import { machineEvents } from "./repository/machine-event";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send("Ok");
});

router.get(
  "/instance-usage/machine/:id",
  async (req: Request, res: Response) => {
    findByMachineId(
      +req.params["id"],
      (err: Error, result: InstanceUsage[]) => {
        if (err) {
          return res.status(500).json({ errorMessage: err.message });
        }

        res.status(200).json({ data: result });
      }
    );
  }
);

router.get(
  "/machine-attribute/machine/:id",
  async (req: Request, res: Response) => {
    MachineAttributeRepo.findByMachineId(
      +req.params["id"],
      (err: Error, result: MachineAttributes[]) => {
        if (err) {
          return res.status(500).json({ errorMessage: err.message });
        }

        res.status(200).json({ data: result });
      }
    );
  }
);

router.get("/collection/:id", async (req: Request, res: Response) => {
  CollectionRepo.findById(
    +req.params["id"],
    (err: Error, result: Collection[]) => {
      if (err) {
        return res.status(500).json({ errorMessage: err.message });
      }

      res.status(200).json({ data: result });
    }
  );
});

router.get("/machine/:id", async (req: Request, res: Response) => {
  MachineRepo.findById(+req.params["id"], (err: Error, result: Machine[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: result });
  });
});

router.get("/collection-size/all", async (req: Request, res: Response) => {
  CollectionSizeRepo.allCollectionSizes(
    (err: Error, result: CollectionSize[]) => {
      if (err) {
        return res.status(500).json({ errorMessage: err.message });
      }

      res.status(200).json({ data: result });
    }
  );
});

router.get("/cpu-usage/all", async (req: Request, res: Response) => {
  CpuUsageRepo.allCpuUsage((err: Error, result: CpuUsage[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: result });
  });
});

router.get("/collection-spread/all", async (req: Request, res: Response) => {
  CpuUsageRepo.allCollectionSpread((err: Error, result: CollectionSpread[]) => {
    if (err) {
      return res.status(500).json({ errorMessage: err.message });
    }

    res.status(200).json({ data: result });
  });
});

router.get("/average-cpu-per-collection", async (req: Request, res: Response) =>
  averageCpuUsagePerCollection()
    .then((result) => {
      res.status(200).json({ data: result });
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: err.message });
    })
);

router.get(
  "/requested-instance-resources/:collection_ids?",
  async (req: Request, res: Response) =>
    requestedInstances(req.params["collection_ids"]?.split(",").map((x) => +x))
      .then((result) => res.status(200).json({ data: result }))
      .catch((err) => res.status(500).json({ errorMessage: err.message }))
);

router.get(
  "/collection-parents/:collection_ids?",
  async (req: Request, res: Response) => {
    parents(
      req.params["collection_ids"] !== undefined
        ? req.params["collection_ids"].split(",").map((x) => +x)
        : []
    )
      .then((result) => res.status(200).json({ data: result }))
      .catch((err) => res.status(500).json({ errorMessage: err.message }));
  }
);

router.get("/unique-collection-ids", async (req: Request, res: Response) =>
  uniqueCollectionIds()
    .then((result) => res.status(200).json({ data: result }))
    .catch((err) => res.status(500).json({ errorMessage: err.message }))
);

router.get(
  "/cpu-resources/:collection_ids?/:from_time?/:to_time?",
  async (req: Request, res: Response) =>
    cpuResources(
      req.params["collection_ids"] !== undefined
        ? req.params["collection_ids"].split(",").map((x) => +x)
        : [],
      req.params["from_time"] !== "undefined"
        ? +req.params["from_time"]
        : undefined,
      req.params["to_time"] !== "undefined" ? +req.params["to_time"] : undefined
    )
      .then((result) => res.status(200).json({ data: result }))
      .catch((err) => res.status(500).json({ errorMessage: err.message }))
);
router.get(
  "/histogram-cpu/:collection_ids?/:instance_index?/:from_time?/:to_time?",
  async (req: Request, res: Response) =>
    cpuResourcesSingleInstance(
      req.params["collection_ids"] !== "undefined"
        ? +req.params["collection_ids"]
        : undefined,
      req.params["instance_index"] !== "undefined"
      ? +req.params["instance_index"]
      : undefined,
      req.params["from_time"] !== "undefined"
        ? +req.params["from_time"]
        : undefined,
      req.params["to_time"] !== "undefined" ? +req.params["to_time"] : undefined
    )
      .then((result) => res.status(200).json({ data: result }))
      .catch((err) => res.status(500).json({ errorMessage: err.message }))
);

router.get(
  "/memory-resources/:collection_ids?/:from_time?/:to_time?",
  async (req: Request, res: Response) =>
    memoryResources(
      req.params["collection_ids"] !== undefined
        ? req.params["collection_ids"].split(",").map((x) => +x)
        : [],
      req.params["from_time"] !== "undefined"
        ? +req.params["from_time"]
        : undefined,
      req.params["to_time"] !== "undefined" ? +req.params["to_time"] : undefined
    )
      .then((result) => res.status(200).json({ data: result }))
      .catch((err) => res.status(500).json({ errorMessage: err.message }))
);

router.get("/collection-events/:ids", async (req: Request, res: Response) =>
  collectionEvents(
    req.params["ids"] !== undefined
      ? req.params["ids"].split(",").map((x) => +x)
      : []
  )
    .then((result) => res.status(200).json({ data: result }))
    .catch((err) => res.status(500).json({ errorMessage: err.message }))
);

router.get(
  "/instance-events/:collection_ids/:machine_ids/:ids",
  async (req: Request, res: Response) =>
    instanceEvents(
      req.params["collection_ids"] !== undefined
        ? req.params["collection_ids"].split(",").map((x) => +x)
        : [],
      req.params["machine_ids"] !== undefined
        ? req.params["machine_ids"].split(",").map((x) => +x)
        : [],
      req.params["ids"] !== undefined
        ? req.params["ids"].split(",").map((x) => +x)
        : []
    )
      .then((result) => res.status(200).json({ data: result }))
      .catch((err) => res.status(500).json({ errorMessage: err.message }))
);

router.get("/machine-events/:ids", async (req: Request, res: Response) =>
  machineEvents(
    req.params["ids"] !== undefined
      ? req.params["ids"].split(",").map((x) => +x)
      : []
  )
    .then((result) => res.status(200).json({ data: result }))
    .catch((err) => res.status(500).json({ errorMessage: err.message }))
);

export { router };
