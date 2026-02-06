import express from "express";
import { loggingRouter } from "./middleware/logger";
import { errorHandler } from "./middleware/errors";
import { requestIdHandler } from "./middleware/requestId";
import { router as healthRouter } from "./health/routes";
import { router as notesRouter } from "./notes/routes";

export function createApp() {
    const server = express();

    server.use(requestIdHandler);
    server.use(express.json());
    server.use(loggingRouter);

    server.use(healthRouter);
    server.use(notesRouter);
    server.use(errorHandler);

    return server;
}
