import { Request, Response, NextFunction } from "express";
import { RequestHandlerParams } from "../utils/types";
import { Helper } from "../utils/helper";
import { NotesError } from "./errors";
import { UnauthorisedError, ValidationError } from "../middleware/errors";
import { NotesConstants } from "./constants";

export const validateUser: RequestHandlerParams = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const userId: unknown = req.headers[NotesConstants.userIdHeader];
    if (!Helper.isEmptyString(userId) && Helper.isValidString(userId)) {
        req.userId = userId.trim();
        next();
    } else {
        throw new UnauthorisedError();
    }
};

export const validateNoteId: RequestHandlerParams = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const rawId: unknown = req.params.id;
    if (!Helper.isValidString(rawId))
        throw new ValidationError([
            { message: NotesError.invalidIdType, field: NotesError.id },
        ]);

    req.noteId = rawId.trim();

    next();
};

export const validateNoteBody: RequestHandlerParams = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const rawTitle: unknown = req.body.title,
        rawBody = req.body.body;

    if (!Helper.isString(rawTitle))
        throw new ValidationError([
            { message: NotesError.invalidTitleType, field: NotesError.title },
        ]);
    if (!Helper.isString(rawBody))
        throw new ValidationError([
            { message: NotesError.invalidBodyType, field: NotesError.body },
        ]);

    const title: string = rawTitle.trim(),
        body: string = rawBody.trim();
    if (!Helper.isValidString(title, 1, 80))
        throw new ValidationError([
            { message: NotesError.invalidTitleLength, field: NotesError.title },
        ]);

    if (!Helper.isValidString(body, 1, 2000))
        throw new ValidationError([
            { message: NotesError.invalidBodyLength, field: NotesError.body },
        ]);

    req.body = {
        title: title,
        body: body,
    };

    next();
};

export const validateNote: RequestHandlerParams = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { title, body } = req.body;
    req.body = {
        title: title,
        body: body,
    };

    next();
};

export const validateNotePagination: RequestHandlerParams = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { limit: rawLimit, offset: rawOffset } = req.query;
    const limit: number = Helper.isNumericInteger(rawLimit)
        ? Math.min(Math.max(Helper.fetchNumericInteger(rawLimit), 1), 50)
        : 20;
    const offset: number = Helper.isNumericInteger(rawOffset)
        ? Helper.fetchNumericInteger(rawOffset)
        : 0;

    req.pagination = { limit: limit, offset: offset };
    next();
};
