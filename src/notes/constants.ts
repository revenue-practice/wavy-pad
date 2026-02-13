import { NoteResult } from "./types";
import path from "node:path";

export class NotesConstants {
    static get folderPath(): string {
        return process.env.FOLDER_PATH ?? "data";
    }

    static get filePath(): string {
        return path.join(this.folderPath, "notes.json");
    }

    static get tempFilePath(): string {
        return path.join(this.folderPath, "notes.json.tmp");
    }

    static fileEncoding = "utf8" as const;

    public static dummyNote: NoteResult[] = [
        {
            id: "AAA",
            title: "AAA",
            body: "AAA",
            createdAt: "...",
            updatedAt: "...",
        },
    ];
}
