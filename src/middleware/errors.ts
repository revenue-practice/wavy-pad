import { NotesError } from "../notes/errors";
import { Helper } from "../utils/helper";
import { ErrorConstants } from "./errors.constants";
import { CustomErrorStructure } from "./types";
import { Request, Response, NextFunction } from "express";

abstract class CustomError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract statusCode: number;
    abstract formatErrors(): CustomErrorStructure[];
}

export class ValidationError extends CustomError {
    constructor(public errors: CustomErrorStructure[]) {
        super();
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    statusCode = 400;
    formatErrors(): CustomErrorStructure[] {
        return this.errors.map((err: CustomErrorStructure) => {
            return { message: err.message, field: err.field };
        });
    }
}

export class InvalidJson extends CustomError {
    constructor() {
        super();
        Object.setPrototypeOf(this, InvalidJson.prototype);
    }

    statusCode = 403;
    formatErrors(): CustomErrorStructure[] {
        return [{ message: ErrorConstants.invalidJson }];
    }
}

export class NotFoundError extends CustomError {
    constructor() {
        super();
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    statusCode = 404;
    formatErrors() {
        return [{ message: ErrorConstants.notFound }];
    }
}

export class InternalError extends CustomError {
    constructor() {
        super();
        Object.setPrototypeOf(this, InternalError.prototype);
    }

    statusCode = 500;
    formatErrors(): CustomErrorStructure[] {
        return [{ message: ErrorConstants.internalServerError }];
    }
}

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (
        error instanceof SyntaxError &&
        !Helper.isNull(error) &&
        NotesError.body in error
    ) {
        return res.status(400).json({
            message: ErrorConstants.invalidJson,
        });
    }

    if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.formatErrors());
    }

    if (error instanceof Error) {
        return res.status(500).json(error);
    }

    return res.status(500).json({
        message: ErrorConstants.genericInternalServerErrorFallback,
    });
};
