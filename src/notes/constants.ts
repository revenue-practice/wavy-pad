import { NullOrUndefined } from "../utils/types";

export class NotesConstants {
    public static folderPath: string = "data";
    public static filePath: string = `${this.folderPath}/notes.json`;
    public static fileEncoding: NullOrUndefined =
        "utf8" as unknown as NullOrUndefined;
}
