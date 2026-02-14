import { NullOrUndefined } from "../utils/types";
import { NoteResult } from "./types";

export class NotesConstants {
    public static folderPath: string = "data";
    public static filePath: string = `${this.folderPath}/notes.json`;
    public static tempFilePath: string = `${this.folderPath}/notes.tmp`;
    public static fileEncoding: NullOrUndefined =
        "utf8" as unknown as NullOrUndefined;

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
