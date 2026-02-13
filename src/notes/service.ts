import { randomUUID } from "node:crypto";
import { Helper } from "../utils/helper";
import { NotesConstants } from "./constants";
import { NotesError } from "./errors";
import { INotesRepo } from "./repo";
import { Note, NoteResult, NotesDetailedResult } from "./types";
import { promises as fs } from "node:fs";
import { InternalError, NotFoundError } from "../middleware/errors";

class NotesRepo implements INotesRepo {
    private isNotesInitialised: boolean = false;
    private notes: Map<string, Note> = new Map<string, Note>();

    async init(): Promise<void> {
        await fs.mkdir(NotesConstants.folderPath, { recursive: true }); // make directory
        const fileExists: boolean = await Helper.checkIfFileExists(
            NotesConstants.filePath,
        );

        if (!fileExists) {
            await fs.writeFile(
                NotesConstants.filePath,
                JSON.stringify(NotesConstants.dummyNote, null, 2),
                NotesConstants.fileEncoding,
            );
        }
        const parsedString: NoteResult[] = await Helper.fetchFileContent();

        if (Array.isArray(parsedString)) {
            for (let index = 0; index < parsedString.length; index += 1) {
                if (Helper.isEitherNullOrUndefined(parsedString[index]))
                    throw new Error(NotesError.invalidContentInDB);
                const obj: NoteResult = parsedString[index]!;
                const { id, ...note } = obj;
                this.notes.set(id, note);
            }
        } else {
            throw new Error(NotesError.invalidContentInDB);
        }

        this.isNotesInitialised = true;
    }

    async assertInit() {
        if (!this.isNotesInitialised) throw new InternalError();
        return this.isNotesInitialised;
    }

    async create(title: string, body: string): Promise<NoteResult> {
        this.assertInit();

        const id: string = randomUUID();
        const note: Note = {
            title: title,
            body: body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const content: NoteResult[] = Helper.fetchMapContentInFileFormat(
            this.notes,
        );
        content.push({ id, ...note });

        await Helper.writeContentInFile(content);

        this.notes.set(id, note);
        return { id: id, ...note };
    }

    async get(id: string): Promise<NoteResult> {
        this.assertInit();

        const response: Note | undefined = this.notes.get(id);
        if (Helper.isEitherNullOrUndefined(response)) throw new NotFoundError();

        return { id: id, ...response };
    }

    async list(limit: number, offset: number): Promise<NotesDetailedResult> {
        this.assertInit();

        if (!(this.notes.size - 1)) throw new NotFoundError();
        const all = Array.from(this.notes.entries()).map(([id, n]) => ({
            id,
            ...n,
        }));
        all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        all.pop();
        const items = all.slice(offset, offset + limit);

        return {
            items,
            total: this.notes.size - 1,
            limit: Math.min(limit, 50),
            offset: offset,
        };
    }

    async update(title: string, body: string, id: string): Promise<NoteResult> {
        this.assertInit();

        if (!this.notes.has(id)) throw new NotFoundError();

        const note: NoteResult = {
            id: id,
            title: title,
            body: body,
            createdAt: this.notes.get(id)!.createdAt,
            updatedAt: new Date().toISOString(),
        };
        this.notes.set(id, note);

        await Helper.writeContentInFile(
            Helper.fetchMapContentInFileFormat(this.notes),
        );

        return note;
    }

    async remove(id: string): Promise<boolean> {
        this.assertInit();

        if (!this.notes.has(id)) throw new NotFoundError();
        this.notes.delete(id);

        await Helper.writeContentInFile(
            Helper.fetchMapContentInFileFormat(this.notes),
        );

        return true;
    }
}

export const notesRepo = new NotesRepo();
