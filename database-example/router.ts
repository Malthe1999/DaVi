import express, {Request, Response} from "express";
import * as Machine from "../react-no-djang/src/models/machine";
import {MachineEvent} from "../react-no-djang/src/types/machine-event";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    Machine.findOne(159613131356, (err: Error, result: MachineEvent) => {
        if (err) {
            return res.status(500).json({"errorMessage": err.message});
        }

        res.status(200).json({"data": result});
    });
});

export {router};
