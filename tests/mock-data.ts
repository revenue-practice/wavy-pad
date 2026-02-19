import { NoteResult } from "../src/notes/types";

export const dummyNote: NoteResult = {
    id: "AAA",
    userId: "AAAA",
    title: "AAA",
    body: "AAA",
    createdAt: "...",
    updatedAt: "...",
};
/* -----------------------------
   INPUT PARAM MOCKS (API calls)
-------------------------------- */
export const mockNote1 = {
    title: "CI pipeline rules",
    body: "All pull requests must pass lint, typecheck, tests, and build.",
};

export const mockNote2 = {
    title: "Testing strategy",
    body: "Unit tests mock dependencies. Router tests use Supertest.",
};

export const mockNote3 = {
    title: "Database safety rules",
    body: "Never allow destructive queries without explicit confirmation.",
};

export const mockNote4 = {
    title: "Edge cases to test before release",
    body: "Test empty inputs, long text, invalid IDs, and unexpected payloads.",
};

export const mockNote5 = {
    title: "Random values",
    body: "Checking random values.",
};

export const mockNote6 = {
    title: "Physical Discipline",
    body: "Total abstinence from sexual feelings.",
};

export const mockNote7 = {
    title: "Mental Discipline",
    body: "Be brave enough to defy laws",
};

export const mockNote8 = {
    title: "Production bugs",
    body: "Catch error using logs",
};

export const invalidJsonString: string =
    '{"title": "Physical Discipline", "body": "Total abstinence"';
export const missingTitleNote = {
    body: "Total abstinence from sexual feelings",
};

export const missingBodyNote = {
    title: "Physical Discipline",
};

export const lengthyTitleNote = {
    title: "This is a very long note title designed specifically to exceed the eighty character validation limit number 3",
    body: "Total abstinence from sexual feelings",
};

export const lengthyBodyNote = {
    title: "This is a very long note title designed",
    body: "Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for no Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note",
};

export const mockNoteParams = {
    title: "API validation checklist (updated)",
    body: "All incoming requests must be validated at the router boundary using Zod.",
};

export const mockHeaders = {
    userId: "x-user-id",
    user1IdHeader: "dfr-ankit008379",
    user2IdHeader: "sxe-shreya12806",
};
