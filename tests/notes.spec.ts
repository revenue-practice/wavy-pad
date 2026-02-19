import { describe, beforeEach, afterEach, it, vi, expect } from "vitest";
import { notesRepo } from "../src/notes/service";
import {
    mockHeaders,
    mockNote1,
    mockNote2,
    mockNote3,
    mockNote4,
    mockNote5,
    mockNote6,
    mockNoteParams,
} from "./mock-data";
import { NoteResult } from "../src/notes/types";
import { afterEachHelper, beforeEachHelper } from "./helper";

describe("POST: /notes [Insert data [note_1] queue test]", () => {
    let ctx: { tempDir: string; logTempDir: string };
    const fixedTime = "2026-02-13T10:10:20.000Z";

    beforeEach(async () => {
        ctx = await beforeEachHelper();

        vi.useFakeTimers();
        vi.setSystemTime(new Date(fixedTime));
    });

    afterEach(async () => {
        await afterEachHelper(ctx);

        vi.useRealTimers();
    });

    it("Success: Insert Data", async () => {
        await notesRepo.create(
            mockHeaders.user1IdHeader,
            mockNote1.title,
            mockNote1.body,
        );
    });
});

describe("POST: /notes [Insert data [note_2] queue test]", () => {
    let ctx: { tempDir: string; logTempDir: string };
    const fixedTime = "2026-02-13T10:12:20.000Z";

    beforeEach(async () => {
        ctx = await beforeEachHelper();

        vi.useFakeTimers();
        vi.setSystemTime(new Date(fixedTime));
    });

    afterEach(async () => {
        await afterEachHelper(ctx);

        vi.useRealTimers();
    });

    it("Success: Insert Data", async () => {
        await notesRepo.create(
            mockHeaders.user1IdHeader,
            mockNote2.title,
            mockNote2.body,
        );
    });
});

describe("POST: /notes [create]", () => {
    const fixedTime = "2026-02-01T02:12:20.000Z";
    let ctx: { tempDir: string; logTempDir: string };

    beforeEach(async () => {
        ctx = await beforeEachHelper();

        vi.useFakeTimers();
        vi.setSystemTime(new Date(fixedTime));
    });

    afterEach(async () => {
        await afterEachHelper(ctx);

        vi.useRealTimers();
    });

    it("Success: Insert Data", async () => {
        const response: NoteResult = await notesRepo.create(
            mockHeaders.user1IdHeader,
            mockNoteParams.title,
            mockNoteParams.body,
        );

        expect(response).toMatchObject({
            title: mockNoteParams.title,
            body: mockNoteParams.body,
            createdAt: fixedTime,
            updatedAt: fixedTime,
        });
    });
});

describe("GET: / [list]", () => {
    let ctx: { tempDir: string; logTempDir: string };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Success: Empty List", async () => {
        const response = await notesRepo.list(mockHeaders.user1IdHeader, 1, 3);

        expect(response).toMatchObject({
            items: [],
            total: 3,
            limit: 1,
            offset: 3,
        });
    });

    it("Success: Data in List", async () => {
        const response = await notesRepo.list(mockHeaders.user1IdHeader, 5, 2);

        expect(response).toMatchObject({
            items: [
                {
                    title: mockNoteParams.title,
                    body: mockNoteParams.body,
                },
            ],
            total: 3,
            limit: 5,
            offset: 2,
        });
    });

    it("Success: Queue Data", async () => {
        const response = await notesRepo.list(mockHeaders.user1IdHeader, 5, 0);

        expect(response).toMatchObject({
            items: [
                {
                    title: mockNote2.title,
                    body: mockNote2.body,
                },
                {
                    title: mockNote1.title,
                    body: mockNote1.body,
                },
                {
                    title: mockNoteParams.title,
                    body: mockNoteParams.body,
                },
            ],
            total: 3,
            limit: 5,
            offset: 0,
        });
    });
});

describe("POST: /notes [Insert data notes concurrency test]", () => {
    let ctx: { tempDir: string; logTempDir: string };
    const fixedTime = "2026-02-15T10:11:11.111Z";

    beforeEach(async () => {
        ctx = await beforeEachHelper();

        vi.useFakeTimers();
        vi.setSystemTime(new Date(fixedTime));
    });

    afterEach(async () => {
        await afterEachHelper(ctx);

        vi.useRealTimers();
    });

    it("Success: Insert Data", async () => {
        await notesRepo.create(
            mockHeaders.user1IdHeader,
            mockNote3.title,
            mockNote3.body,
        );
        await notesRepo.create(
            mockHeaders.user1IdHeader,
            mockNote4.title,
            mockNote4.body,
        );
        await notesRepo.create(
            mockHeaders.user1IdHeader,
            mockNote5.title,
            mockNote5.body,
        );
        await notesRepo.create(
            mockHeaders.user1IdHeader,
            mockNote6.title,
            mockNote6.body,
        );
    });
});

describe("GET: / [list]", () => {
    let ctx: { tempDir: string; logTempDir: string };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Success: Concurrent Data", async () => {
        const response = await notesRepo.list(mockHeaders.user1IdHeader, 10, 0);

        expect(response).toEqual({
            items: expect.arrayContaining([
                expect.objectContaining({
                    title: mockNoteParams.title,
                    body: mockNoteParams.body,
                }),
                expect.objectContaining({
                    title: mockNote1.title,
                    body: mockNote1.body,
                }),
                expect.objectContaining({
                    title: mockNote2.title,
                    body: mockNote2.body,
                }),
                expect.objectContaining({
                    title: mockNote3.title,
                    body: mockNote3.body,
                }),
                expect.objectContaining({
                    title: mockNote4.title,
                    body: mockNote4.body,
                }),
                expect.objectContaining({
                    title: mockNote5.title,
                    body: mockNote5.body,
                }),
                expect.objectContaining({
                    title: mockNote6.title,
                    body: mockNote6.body,
                }),
            ]),
            total: 7,
            limit: 10,
            offset: 0,
        });
    });
});
