import { NotesConstants } from "../notes/constants";
import { NotesError } from "../notes/errors";
import { Note, NoteResult } from "../notes/types";
import { Constants } from "./constants";
import { NullOrUndefined } from "./types";
import { promises as fs } from "node:fs";

export class Helper {
    public static isNull(prop: unknown): prop is null {
        return prop === null;
    }

    public static isUndefined(prop: unknown): prop is undefined {
        return prop === undefined;
    }

    public static isEitherNullOrUndefined(
        prop: unknown,
    ): prop is NullOrUndefined {
        return this.isNull(prop) || this.isUndefined(prop);
    }

    public static isNeitherNullNorUndefined(
        prop: unknown,
    ): prop is NullOrUndefined {
        return !this.isEitherNullOrUndefined(prop);
    }

    public static isObject(prop: unknown): prop is object {
        return (
            this.isNeitherNullNorUndefined(prop) &&
            typeof prop === Constants.object
        );
    }

    public static isString(prop: unknown): prop is string {
        return (
            this.isNeitherNullNorUndefined(prop) &&
            typeof prop === Constants.string
        );
    }

    public static isInteger(prop: unknown): prop is number {
        return (
            this.isNeitherNullNorUndefined(prop) &&
            typeof prop === Constants.number &&
            !Number.isNaN(prop)
        );
    }

    public static isBoolean(prop: unknown): prop is boolean {
        return (
            this.isNeitherNullNorUndefined(prop) &&
            typeof prop === Constants.boolean
        );
    }

    public static isNumericInteger(prop: unknown): prop is number {
        return this.isValidString(prop, 1) && /^\d+$/.test(prop);
    }

    public static fetchNumericInteger(prop: unknown): number {
        return Number(prop);
    }

    public static isEmptyString(prop: unknown): prop is string {
        return this.isString(prop) && prop.trim() === "";
    }

    public static isValidString(
        prop: unknown,
        minLength?: number,
        maxLength?: number,
    ): prop is string {
        return (
            this.isString(prop) &&
            (minLength === undefined || (prop as string).length >= minLength) &&
            (maxLength === undefined || (prop as string).length <= maxLength)
        );
    }

    public static fetchErrorMessage(error: unknown, fallback: string): string {
        return error instanceof Error ? error.message : fallback;
    }

    /* eslint-disable */
    public static async checkIfFileExists(prop: string): Promise<boolean> {
        try {
            await fs.access(prop, fs.constants.F_OK);
        } catch (error) {
            return false;
        }

        return true;
    }

    public static isEntityParsable(prop: unknown): boolean {
        try {
            if (JSON.parse(prop as string)) {
            }
        } catch (error) {
            const message: string = this.fetchErrorMessage(
                error,
                NotesError.fileDoNotExists,
            );
            console.error(message);
            return false;
        }
        return true;
    }

    /* eslint-enable */
    public static fetchMapContentInFileFormat(
        notes: Map<string, Note>,
    ): NoteResult[] {
        const result: NoteResult[] = [];
        for (const [key, value] of notes) {
            const note = {
                id: key,
                title: value.title,
                body: value.body,
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
            };

            result.push(note);
        }

        return result;
    }

    public static async fetchFileContent(): Promise<NoteResult[]> {
        const response = await fs.readFile(
            NotesConstants.filePath,
            NotesConstants.fileEncoding,
        );
        if (!this.isEntityParsable(response))
            throw new Error(NotesError.notesFileInitialisationFailure);

        const fileContent: string = response as unknown as string;
        const parsedString: NoteResult[] = JSON.parse(fileContent);

        if (!Array.isArray(parsedString))
            throw new Error(NotesError.invalidContentInDB);
        return parsedString;
    }
}
