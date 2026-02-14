import express, { Request, Response } from "express";
import { HealthRoutes } from "./routes.constants";
import { Constants } from "../utils/constants";

export const router = express.Router();

router.get(HealthRoutes.getHealthRoute(), (req: Request, res: Response) => {
    return res.status(Constants.STATUS_CODES[200]).json({ ok: true });
});
