import { randomUUID } from "node:crypto";
import { Helper } from "../utils/helper";
import { NotesConstants } from "./constants";
import { NotesError } from "./errors";
import { INotesRepo } from "./repo";
import { Note, NoteResult, NotesDetailedResult, NotesLogger } from "./types";
import { promises as fs } from "node:fs";
import { InternalError, NotFoundError } from "../middleware/errors";

class NotesRepo implements INotesRepo {
    private isNotesInitialised: boolean = false;
    private notes: Map<string, Note> = new Map<string, Note>();
    private writeLock: Promise<void> = Promise.resolve();
    private async doAtomicWrite(
        content: NoteResult[] | NotesLogger[],
        tempFilePath?: string,
        filePath?: string,
    ) {
        await fs.writeFile(
            tempFilePath ?? NotesConstants.tempFilePath,
            JSON.stringify(content, null, 2),
            NotesConstants.fileEncoding,
        );
        await fs.rename(
            tempFilePath ?? NotesConstants.tempFilePath,
            filePath ?? NotesConstants.filePath,
        );
    }

    private persist(
        content: NoteResult[] | NotesLogger[],
        tempFilePath?: string,
        filePath?: string,
    ): Promise<void> {
        const run = async () => {
            await this.doAtomicWrite(content, tempFilePath, filePath);
        };
        this.writeLock = this.writeLock.then(run, run);

        return this.writeLock;
    }

    async init(): Promise<void> {
        await fs.mkdir(NotesConstants.folderPath, { recursive: true }); // make directory
        const fileExists: boolean = await Helper.checkIfFileExists(
            NotesConstants.filePath,
        );

        if (!fileExists) {
            await fs.writeFile(
                NotesConstants.filePath,
                NotesConstants.dummyNote,
                NotesConstants.fileEncoding,
            );
        }
        const parsedString: NoteResult[] =
            await Helper.fetchFileContent<NoteResult>();

        if (Array.isArray(parsedString)) {
            if (parsedString.length) {
                for (let index = 0; index < parsedString.length; index += 1) {
                    if (Helper.isEitherNullOrUndefined(parsedString[index]))
                        throw new Error(NotesError.invalidContentInDB);
                    const obj: NoteResult = parsedString[index]!;
                    const { id, ...note } = obj;
                    this.notes.set(id, note);
                }
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

        this.notes.set(id, note);
        await this.persist(content);

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

        if (!this.notes.size) throw new NotFoundError();
        const all = Array.from(this.notes.entries()).map(([id, n]) => ({
            id,
            ...n,
        }));
        all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        const items = all.slice(offset, offset + limit);

        return {
            items,
            total: this.notes.size,
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
        await this.persist(Helper.fetchMapContentInFileFormat(this.notes));

        return note;
    }

    async remove(id: string): Promise<boolean> {
        this.assertInit();
        if (!this.notes.has(id)) throw new NotFoundError();

        this.notes.delete(id);
        await this.persist(Helper.fetchMapContentInFileFormat(this.notes));

        return true;
    }

    async writeInFile(
        content: NotesLogger,
        tempFilePath?: string,
        filePath?: string,
    ): Promise<void> {
        const fetchLogs: NotesLogger[] =
            await Helper.fetchFileContent<NotesLogger>(filePath);
        fetchLogs.push(content);

        this.persist(fetchLogs, tempFilePath, filePath);
    }
}

export const notesRepo = new NotesRepo();
