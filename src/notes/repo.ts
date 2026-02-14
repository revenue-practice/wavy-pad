import { NoteResult, NotesDetailedResult } from "./types";

export interface INotesRepo {
    init(): Promise<void>;

    create(title: string, body: string): Promise<NoteResult>;
    get(id: string): Promise<NoteResult>;
    list(limit: number, offset: number): Promise<NotesDetailedResult>;
    update(title: string, body: string, id: string): Promise<NoteResult>;
    remove(id: string): Promise<boolean>;
}
