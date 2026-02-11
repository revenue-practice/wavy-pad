import { randomUUID } from "crypto";
import { Note, NoteResult, NotesDetailedResult } from "./types";
import { Helper } from "../utils/helper";
import { NotFoundError } from "../middleware/errors";

let notes = new Map<string, Note>();

export const create = (title: string, body: string): NoteResult => {
    const id: string = randomUUID();
    const note: Note = {
        title: title,
        body: body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    notes.set(id, note);
    return { id: id, ...note };
};

export const get = (id: string): NoteResult => {
    const response: Note | undefined = notes.get(id);
    if (Helper.isEitherNullOrUndefined(response)) throw new NotFoundError();

    return { id: id, ...response };
};

export const list = (limit: number, offset: number): NotesDetailedResult => {
    if (!notes.size) throw new NotFoundError();

    const all = Array.from(notes.entries()).map(([id, n]) => ({ id, ...n }));
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const items = all.slice(offset, offset + limit);

    return {
        items,
        total: notes.size,
        limit: Math.min(limit, 50),
        offset: offset,
    };
};

export const update = (title: string, body: string, id: string): NoteResult => {
    if (!notes.has(id)) throw new NotFoundError();

    const note: NoteResult = {
        id: id,
        title: title,
        body: body,
        createdAt: notes.get(id)!.createdAt,
        updatedAt: new Date().toISOString(),
    };
    notes.set(id, note);

    return note;
};

export const remove = (id: string): boolean => {
    if (!notes.has(id)) throw new NotFoundError();

    notes.delete(id);
    return true;
};

export const __seedNotes = (data: NoteResult[]) => {
    notes = new Map(data.map(({ id, ...note }) => [id, { ...note }]));
};

export const __getNotesUnsafe = (): NoteResult[] =>
    Array.from(notes.entries()).map(([id, note]) => ({
        id,
        ...note,
    }));
