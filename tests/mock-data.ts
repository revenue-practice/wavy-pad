import { Note, NoteResult } from "../src/notes/types";

/**
 * Base stored note (NO id)
 * This matches `Note`
 */
const baseStoredNote: Note = {
    title: "Base note",
    body: "Base body",
    createdAt: "2026-01-20T10:15:30.000Z",
    updatedAt: "2026-01-20T10:15:30.000Z",
};

/**
 * Helper to create API-returned notes (WITH id)
 * This matches `NoteResult`
 */
const noteResult = (id: string, overrides?: Partial<Note>): NoteResult => ({
    id,
    ...baseStoredNote,
    ...overrides,
});

export const dummyNote: NoteResult = {
    id: "AAA",
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

export const invalidJsonString =
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

export const mockLengthyParams = {
    title: "This is a very long note title designed specifically to exceed the eighty character validation limit",
    body: "Body content",
};

export const mockTrimmedParams = {
    title: "This is a very long note title designed specifically to exceed the eighty",
    body: "Body content",
};

export const mockNonExistentId = "note_non_existent";
export const mockExistentId = "note_1";

/* -----------------------------
   SEEDED STORE DATA
-------------------------------- */

export const mockNotes: NoteResult[] = [
    noteResult("note_1", {
        title: "CI pipeline rules",
        body: "All pull requests must pass lint, typecheck, tests, and build.",
        createdAt: "2026-01-21T07:20:00.000Z",
        updatedAt: "2026-01-21T07:20:00.000Z",
    }),
    noteResult("note_2", {
        title: "Testing strategy",
        body: "Unit tests mock dependencies. Router tests use Supertest.",
        createdAt: "2026-01-22T09:05:10.000Z",
        updatedAt: "2026-01-22T09:05:10.000Z",
    }),
    noteResult("note_3", {
        title: "Database safety rules",
        body: "Never allow destructive queries without explicit confirmation.",
        createdAt: "2026-01-23T11:45:00.000Z",
        updatedAt: "2026-01-23T11:45:00.000Z",
    }),
];

/* -----------------------------
   EXPECTED RESULTS
-------------------------------- */

export const mockResultResponseAtFetch: NoteResult[] = [
    {
        id: "note_3",
        title: "Database safety rules",
        body: "Never allow destructive queries without explicit confirmation.",
        createdAt: "2026-01-23T11:45:00.000Z",
        updatedAt: "2026-01-23T11:45:00.000Z",
    },
    {
        id: "note_2",
        title: "Testing strategy",
        body: "Unit tests mock dependencies. Router tests use Supertest.",
        createdAt: "2026-01-22T09:05:10.000Z",
        updatedAt: "2026-01-22T09:05:10.000Z",
    },
    {
        id: "note_1",
        title: "CI pipeline rules",
        body: "All pull requests must pass lint, typecheck, tests, and build.",
        createdAt: "2026-01-21T07:20:00.000Z",
        updatedAt: "2026-01-21T07:20:00.000Z",
    },
];

export const mockNotesAfterInsert: NoteResult[] = [
    ...mockNotes,
    noteResult("note_new", {
        title: mockNoteParams.title,
        body: mockNoteParams.body,
        createdAt: "2026-02-01T02:12:20.000Z",
        updatedAt: "2026-02-01T02:12:20.000Z",
    }),
];

export const mockNotesAfterDelete: NoteResult[] = [mockNotes[0], mockNotes[1]];

export const mockNotesAfterUpdate: NoteResult[] = [
    mockNotes[0],
    mockNotes[1],
    noteResult("note_3", {
        title: "Edge cases to test before release",
        body: "Test empty inputs, long text, invalid IDs, and unexpected payloads.",
        createdAt: "2026-01-23T11:45:00.000Z",
        updatedAt: "2026-01-21T08:42:10.000Z",
    }),
];
