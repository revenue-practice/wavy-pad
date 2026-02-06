export class NotesError {
    public static id = "id";
    public static title = "title";
    public static body = "body";

    public static invalidIdType = "Id must be a valid string";
    public static invalidTitleType = "Title must be a valid string";
    public static invalidBodyType = "Body must be a valid string";

    public static invalidTitleLength =
        "Title length should be <= 80 characters";
    public static invalidBodyLength =
        "Body length should be <= 2000 characters";
}
