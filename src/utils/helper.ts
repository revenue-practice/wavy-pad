import { NotesError } from "../notes/errors";
import { Constants } from "./constants";
import { NullOrUndefined } from "./types";
import pool from "../models/pool";
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

    public static async executeQueryAsyncWithoutLock(query: string, queryParams?: unknown[]) {
        try {
            const queryConfig = {
                text: query,
                queryTimeout: Constants.DB_TIMEOUTS.QUERY_TIMEOUT
            }

            await pool.query(Constants.DB_COMMANDS.BEGIN);
            const response = await pool.query(queryConfig, queryParams);
            await pool.query(Constants.DB_COMMANDS.COMMIT);

            return response;
        }
        catch (error) {
            const message: string = this.fetchErrorMessage(
                error,
                NotesError.writeOperationFailure,
            );
            throw new Error(message);
        }
    } 
}
