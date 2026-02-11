import { Helper } from "../utils/helper";
import { NotesConstants } from "./constants";
import { NotesError } from "./errors";
import { INotesRepo } from "./repo";
import { Note, NoteResult, NotesDetailedResult } from "./types";
import { promises as fs } from "node:fs";

class NotesRepo implements INotesRepo {
    private isNotesInitialised: boolean = false;
    private notes: Map<string, Note> = new Map<string, Note>();

    async init(): Promise<void> {
        try {
            await fs.mkdir(NotesConstants.folderPath, { recursive: true }); // make directory
            const fileExists: boolean = await Helper.checkIfFileExists(
                NotesConstants.filePath,
            );

            if (!fileExists) {
                await fs.writeFile(
                    NotesConstants.filePath,
                    [],
                    NotesConstants.fileEncoding,
                );
            } else {
                const response = await fs.readFile(
                    NotesConstants.filePath,
                    NotesConstants.fileEncoding,
                );
                if (!Helper.isEntityParsable(response))
                    throw new Error(NotesError.notesFileInitialisationFailure);

                const fileContent: string = response as unknown as string;
                const parsedString = JSON.parse(fileContent);

                if (Array.isArray(parsedString)) {
                    for (
                        let index = 0;
                        index < parsedString.length;
                        index += 1
                    ) {
                        const obj: NoteResult = parsedString[index];
                        const { id, ...note } = obj;
                        this.notes.set(id, note);
                    }

                    console.log(this.notes);
                    this.isNotesInitialised = true;
                } else {
                    throw new Error(NotesError.invalidContentInDB);
                }
            }
        } catch (error) {
            const message: string =
                error instanceof Error
                    ? error.message
                    : NotesError.notesFileInitialisationFailure;
            console.error(message);
        }
    }

    create(title: string, body: string): Promise<NoteResult> {
        throw new Error("Method not implemented.");
    }

    get(id: string): Promise<NoteResult> {
        throw new Error("Method not implemented.");
    }

    list(limit: number, offset: number): Promise<NotesDetailedResult> {
        throw new Error("Method not implemented.");
    }

    update(title: string, body: string, id: string): Promise<NoteResult> {
        throw new Error("Method not implemented.");
    }

    remove(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

export const notesRepo = new NotesRepo();
