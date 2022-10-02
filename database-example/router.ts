import express, {Request, Response} from "express";
import * as MachineEventModel from "./models/machine-event";
import {MachineEvent} from "./types/machine-event";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    MachineEventModel.findOne(385611578151, (err: Error, result: MachineEvent) => {
        if (err) {
            return res.status(500).json({"errorMessage": err.message});
        }

        res.status(200).json({"data": result});
    });
});

export {router};
