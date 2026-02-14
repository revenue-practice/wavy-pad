import { NotesRoutes } from "./routes.constants";
import { NoteResult, NotesDetailedResult } from "./types";
import express, { Request, Response } from "express";
import {
    validateNote,
    validateNoteBody,
    validateNoteId,
    validateNotePagination,
} from "./validate";
import { notesRepo } from "./service";
import { Constants } from "../utils/constants";

export const router = express.Router();

router.post(
    NotesRoutes.getDefaultRoute(),
    validateNoteBody,
    validateNote,
    async (req: Request, res: Response) => {
        const title: string = req.body.title,
            body: string = req.body.body;
        const response: NoteResult = await notesRepo.create(title, body);
        return res.status(Constants.STATUS_CODES[201]).json(response);
    },
);

router.get(
    NotesRoutes.getID(),
    validateNoteId,
    async (req: Request, res: Response) => {
        const id: string = req.noteId;
        const response: NoteResult = await notesRepo.get(id);

        return res.status(Constants.STATUS_CODES[200]).json(response);
    },
);

router.get(
    NotesRoutes.getDefaultRoute(),
    validateNotePagination,
    async (req: Request, res: Response) => {
        const limit: number = req.pagination!.limit,
            offset: number = req.pagination!.offset;

        const response: NotesDetailedResult = await notesRepo.list(
            limit,
            offset,
        );
        return res.status(Constants.STATUS_CODES[200]).json(response);
    },
);

router.put(
    NotesRoutes.getID(),
    validateNoteId,
    validateNoteBody,
    validateNote,
    async (req: Request, res: Response) => {
        const id: string = req.noteId,
            title: string = req.body.title,
            body = req.body.body;

        const response: NoteResult = await notesRepo.update(title, body, id);
        return res.status(Constants.STATUS_CODES[200]).json(response);
    },
);

router.delete(
    NotesRoutes.getID(),
    validateNoteId,
    async (req: Request, res: Response) => {
        const id: string = req.noteId;

        await notesRepo.remove(id);
        return res.status(204).send();
    },
);
