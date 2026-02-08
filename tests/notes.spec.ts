import { mockNonExistentId, mockNoteParams, mockNotes } from "./mock-data";
import { it, expect, vi, beforeEach, describe, afterEach } from "vitest";
import {
    create,
    get,
    __seedNotes,
    __getNotesUnsafe,
    list,
    update,
    remove,
} from "../src/notes/store";
import { NotFoundError } from "../src/middleware/errors";

describe("Post notes", () => {
    const fixedTime = "2026-02-01T02:12:20.000Z";

    beforeEach(() => {
        __seedNotes(mockNotes);
        vi.useFakeTimers();
        vi.setSystemTime(new Date(fixedTime));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("inserts a new note", () => {
        const response = create(mockNoteParams.title, mockNoteParams.body);

        const notes = __getNotesUnsafe();

        expect(notes).toHaveLength(mockNotes.length + 1);

        const created = notes.at(-1)!;

        expect(created).toMatchObject({
            title: mockNoteParams.title,
            body: mockNoteParams.body,
            createdAt: fixedTime,
            updatedAt: fixedTime,
        });

        expect(response).toMatchObject({
            title: mockNoteParams.title,
            body: mockNoteParams.body,
            createdAt: fixedTime,
            updatedAt: fixedTime,
        });
    });
});

describe("Fetch note via id", () => {
    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    it("throws for non-existent note", () => {
        expect(() => get(mockNonExistentId)).toThrow(NotFoundError);
    });

    it("fetches an existing note", () => {
        const existingId = mockNotes[0].id;

        const response = get(existingId);

        expect(response).toMatchObject({
            id: existingId,
            title: mockNotes[0].title,
            body: mockNotes[0].body,
        });
    });
});

describe("Fetch notes", () => {
    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    it("returns notes with limit and offset", () => {
        const response = list(1, 1);

        expect(response).toStrictEqual({
            items: [mockNotes[1]],
            total: mockNotes.length,
            limit: 1,
            offset: 1,
        });
    });
});

describe("Update notes", () => {
    const fixedTime = "2026-01-21T08:42:10.000Z";

    beforeEach(() => {
        __seedNotes(mockNotes);
        vi.useFakeTimers();
        vi.setSystemTime(new Date(fixedTime));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("throws error for non-existent note", () => {
        expect(() =>
            update("New title", "New body", mockNonExistentId),
        ).toThrow(NotFoundError);
    });

    it("updates an existing note", () => {
        const id = mockNotes[2].id;

        const response = update("Updated title", "Updated body", id);

        const notes = __getNotesUnsafe();
        const updated = notes.find((n) => n.id === id);

        expect(updated).toMatchObject({
            title: "Updated title",
            body: "Updated body",
            updatedAt: fixedTime,
        });

        expect(response).toMatchObject({
            title: "Updated title",
            body: "Updated body",
        });
    });
});

describe("Delete notes", () => {
    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    it("deletes an existing note", () => {
        const id = mockNotes[2].id;

        const response = remove(id);

        const notes = __getNotesUnsafe();

        expect(notes.find((n) => n.id === id)).toBeUndefined();
        expect(notes).toHaveLength(mockNotes.length - 1);
        expect(response).toBeDefined();
    });
});
