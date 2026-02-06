import express, { Request, Response } from "express";
import { HealthRoutes } from "./routes.constants";

export const router = express.Router();

router.get(HealthRoutes.getHealthRoute(), (req: Request, res: Response) => {
    return res.status(200).json({ ok: true });
});
