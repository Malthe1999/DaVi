import dotenv from "dotenv";
import express, {Express} from "express";
import cors from "cors";
import {router} from "./router";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);

const port = process.env.PORT || 17500;
app.listen(port, () => {
    // console.log(`API app listening on port ${port}`)
});
