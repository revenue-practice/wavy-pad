import { NotesRoutes } from "./routes.constants";
import { NoteResult, NotesDetailedResult } from "./types";
import express, { Request, Response } from "express";
import {
    validateNote,
    validateNoteBody,
    validateNoteId,
    validateNotePagination,
} from "./validate";
import {
    remove,
    list,
    get,
    create,
    update,
} from "./store";

export const router = express.Router();

router.post(
    NotesRoutes.getDefaultRoute(),
    validateNoteBody,
    validateNote,
    (req: Request, res: Response) => {
        const title: string = req.body.title,
            body: string = req.body.body;
        const response: NoteResult = create(title, body);
        return res.status(201).json(response);
    },
);

router.get(
    NotesRoutes.getID(),
    validateNoteId,
    (req: Request, res: Response) => {
        const id: string = req.noteId;
        const response: NoteResult = get(id);

        return res.status(200).json(response);
    },
);

router.get(
    NotesRoutes.getDefaultRoute(),
    validateNotePagination,
    (req: Request, res: Response) => {
        const limit: number = req.pagination!.limit,
            offset: number = req.pagination!.offset;

        const response: NotesDetailedResult = list(limit, offset);
        return res.status(200).json(response);
    },
);

router.put(
    NotesRoutes.getID(),
    validateNoteId,
    validateNoteBody,
    validateNote,
    (req: Request, res: Response) => {
        const id: string = req.noteId,
            title: string = req.body.title,
            body = req.body.body;

        const response: NoteResult = update(title, body, id);
        return res.status(200).json(response);
    },
);

router.delete(
    NotesRoutes.getID(),
    validateNoteId,
    (req: Request, res: Response) => {
        const id: string = req.noteId;

        remove(id);
        return res.status(204).send();
    },
);
