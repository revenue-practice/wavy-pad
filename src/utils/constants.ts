export class Constants {
    public static number: string = "number";
    public static string: string = "string";
    public static boolean: string = "boolean";
    public static object: string = "object";
    public static STATUS_CODES = {
        200: 200,
        201: 201,
        202: 202,
        400: 400,
        401: 401,
        404: 404,
        500: 500,
    };

    public static DB_TABLES = {
        NOTES: "notes",
    };

    public static DB_COMMANDS = {
        BEGIN: "BEGIN",
        SELECT: "SELECT",
        COMMIT: "COMMIT",
        INSERT: "INSERT",
        UPDATE: "UPDATE",
        ROLLBACK: "ROLLBACK"
    };

    public static DB_TIMEOUTS = {
        QUERY_TIMEOUT: 10000,
    };
}
