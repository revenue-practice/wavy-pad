import { NotesRoutes } from "./routes.constants";
import { NoteResult, NotesDetailedResult } from "./types";
import express, { Request, Response } from "express";
import {
    validateNote,
    validateNoteBody,
    validateNoteId,
    validateNotePagination,
    validateUser,
} from "./validate";
import { notesRepo } from "./service";
import { Constants } from "../utils/constants";

export const router = express.Router();

router.post(
    NotesRoutes.getDefaultRoute(),
    validateUser,
    validateNoteBody,
    validateNote,
    async (req: Request, res: Response) => {
        const title: string = req.body.title,
            body: string = req.body.body,
            userId: string = req.userId;
        const response: NoteResult = await notesRepo.create(
            userId,
            title,
            body,
        );
        return res.status(Constants.STATUS_CODES[201]).json(response);
    },
);

router.get(
    NotesRoutes.getID(),
    validateUser,
    validateNoteId,
    async (req: Request, res: Response) => {
        const id: string = req.noteId,
            userId: string = req.userId;
        const response: NoteResult = await notesRepo.get(userId, id);

        return res.status(Constants.STATUS_CODES[200]).json(response);
    },
);

router.get(
    NotesRoutes.getDefaultRoute(),
    validateUser,
    validateNotePagination,
    async (req: Request, res: Response) => {
        const userId: string = req.userId,
            limit: number = req.pagination!.limit,
            offset: number = req.pagination!.offset;

        const response: NotesDetailedResult = await notesRepo.list(
            userId,
            limit,
            offset,
        );
        return res.status(Constants.STATUS_CODES[200]).json(response);
    },
);

router.put(
    NotesRoutes.getID(),
    validateUser,
    validateNoteId,
    validateNoteBody,
    validateNote,
    async (req: Request, res: Response) => {
        const id: string = req.noteId,
            title: string = req.body.title,
            body = req.body.body,
            userId: string = req.userId;

        const response: NoteResult = await notesRepo.update(
            userId,
            title,
            body,
            id,
        );
        return res.status(Constants.STATUS_CODES[200]).json(response);
    },
);

router.delete(
    NotesRoutes.getID(),
    validateUser,
    validateNoteId,
    async (req: Request, res: Response) => {
        const id: string = req.noteId,
            userId: string = req.userId;

        await notesRepo.remove(userId, id);
        return res.status(204).send();
    },
);
