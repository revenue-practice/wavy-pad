import path from "node:path";

export class NotesConstants {
    static get folderPath(): string {
        return process.env.FOLDER_PATH ?? "data";
    }

    static get loggerFolderPath(): string {
        return process.env.LOGGER_PATH ?? this.folderPath;
    }

    static get filePath(): string {
        return path.join(this.folderPath, "notes.json");
    }

    static get loggerFilePath(): string {
        return path.join(this.loggerFolderPath, "logger.json");
    }

    static get tempFilePath(): string {
        return path.join(this.folderPath, "notes.json.tmp");
    }

    static get tempLoggerPath(): string {
        return path.join(this.loggerFolderPath, "logger.json.tmp");
    }

    static fileEncoding = "utf8" as const;

    public static dummyNote: string = "[]";
}
