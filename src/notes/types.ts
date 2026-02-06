import { Request } from "express";

export type NoteRequestBody = {
    title: string;
    body: string;
};

export type NoteRequest = Request<{}, unknown, NoteRequestBody>; // eslint-disable-line

export type Note = NoteRequestBody & {
    createdAt: string;
    updatedAt: string;
};

export type NoteResult = Note & {
    id: string;
};

export type NotesDetailedResult = {
    items: NoteResult[];
    total?: number;
    limit?: number;
    offset?: number;
};
