import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

export const requestIdHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const requestId: string = randomUUID();
    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);

    next();
};
