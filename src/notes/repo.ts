import { NoteEmptyResponse, NoteResult, NotesDetailedResult } from "./types";

export interface INotesRepo {
    create(userId: string, title: string, body: string): Promise<NoteResult>;
    get(userId: string, id: string): Promise<NoteResult>;
    list(
        userId: string,
        limit: number,
        offset: number,
    ): Promise<NotesDetailedResult>;
    update(
        userId: string,
        title: string,
        body: string,
        id: string,
    ): Promise<NoteResult>;
    remove(userId: string, id: string): Promise<boolean>;
}
