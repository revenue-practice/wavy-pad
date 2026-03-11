import { Request, Response, NextFunction } from "express";
import { NotesConstants } from "../notes/constants";
import { NotesLogger } from "../notes/types";
import { promises as fs } from "node:fs";

export const loggingRouter = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = Date.now();

    res.on("finish", async () => {
        await fs.mkdir(NotesConstants.loggerFolderPath, { recursive: true }); // make directory
        const resTime = Date.now() - start;
        const content: NotesLogger = {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: resTime.toFixed(3),
            rid: req.requestId!,
        };
        await fs.writeFile(
            NotesConstants.loggerFilePath,
            JSON.stringify(content, null, 2),
            NotesConstants.fileEncoding,
        );
    });

    next();
};
