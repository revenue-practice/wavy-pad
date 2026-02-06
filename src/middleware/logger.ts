import { Request, Response, NextFunction } from "express";

export const loggingRouter = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = Date.now();

    res.on("finish", () => {
        const responseTime = Date.now() - start;
        console.log(
            req.method,
            req.url,
            res.statusCode,
            responseTime.toFixed(3),
            `rid = ${req.requestId}`,
        );
    });

    next();
};
