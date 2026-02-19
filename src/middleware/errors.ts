import { NotesError } from "../notes/errors";
import { Constants } from "../utils/constants";
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

    statusCode = Constants.STATUS_CODES[400];
    formatErrors(): CustomErrorStructure[] {
        return this.errors.map((err: CustomErrorStructure) => {
            return { message: err.message, field: err.field };
        });
    }
}

export class UnauthorisedError extends CustomError {
    constructor() {
        super();
        Object.setPrototypeOf(this, UnauthorisedError.prototype);
    }

    statusCode = 401;
    formatErrors(): CustomErrorStructure[] {
        return [{ message: ErrorConstants.unauthorised }];
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

    statusCode = Constants.STATUS_CODES[404];
    formatErrors() {
        return [{ message: ErrorConstants.notFound }];
    }
}

export class InternalError extends CustomError {
    constructor() {
        super();
        Object.setPrototypeOf(this, InternalError.prototype);
    }

    statusCode = Constants.STATUS_CODES[500];
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
        return res.status(Constants.STATUS_CODES[400]).json({
            message: ErrorConstants.invalidJson,
        });
    }

    if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.formatErrors());
    }

    if (error instanceof Error) {
        return res.status(Constants.STATUS_CODES[500]).json(error);
    }

    return res.status(Constants.STATUS_CODES[500]).json({
        message: ErrorConstants.genericInternalServerErrorFallback,
    });
};
