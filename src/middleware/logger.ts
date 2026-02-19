import { Request, Response, NextFunction } from "express";
import { notesRepo } from "../notes/service";
import { NotesConstants } from "../notes/constants";
import { NotesLogger } from "../notes/types";
import { promises as fs } from "node:fs";
import { Helper } from "../utils/helper";

export const loggingRouter = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const start = Date.now();

    res.on("finish", async () => {
        await fs.mkdir(NotesConstants.loggerFolderPath, { recursive: true }); // make directory
        const doFileExists: boolean = await Helper.checkIfFileExists(
            NotesConstants.loggerFilePath,
        );
        if (!doFileExists) {
            await fs.writeFile(
                NotesConstants.loggerFilePath,
                NotesConstants.dummyNote,
                NotesConstants.fileEncoding,
            );
        }

        const resTime = Date.now() - start;
        const content: NotesLogger = {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: resTime.toFixed(3),
            rid: req.requestId!,
        };
        await notesRepo.writeInFile(
            content,
            NotesConstants.tempLoggerPath,
            NotesConstants.loggerFilePath,
        );
    });

    next();
};
