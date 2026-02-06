import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { NotesRoutes } from "../src/notes/routes.constants";
import { mockNotes, mockResultResponseAtFetch } from "./mock-data";
import { NotesError } from "../src/notes/errors";
import { ErrorConstants } from "../src/middleware/errors.constants";
import { __seedNotes } from "../src/notes/store";

describe("Post notes validation", () => {
    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    const app = createApp();

    it("Invalid JSON", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .set("Content-Type", "application/json")
            .send(
                '{"title": "Physical Discipline", "body": "Total abstinence"',
            ); // missing closing }

        expect(response.statusCode).toStrictEqual(400);
        expect(response.header["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({ message: "Invalid Json" });
    });

    it("Success validation", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send({
                title: "Physical Discipline",
                body: "Total abstinence from sexual feelings",
            });

        expect(response.statusCode).toStrictEqual(201);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject({
            title: "Physical Discipline",
            body: "Total abstinence from sexual feelings",
        });
    });

    it("Error for missing title", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send({
                body: "Total abstinence from sexual feelings",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleType, field: NotesError.title },
        ]);
    });

    it("Error for title length > 80 characters", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send({
                title: "This is a very long note title designed specifically to exceed the eighty character validation limit number 3",
                body: "Total abstinence from sexual feelings",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleLength, field: NotesError.title },
        ]);
    });

    it("Error for missing body", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send({
                title: "Physical Discipline",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyType, field: NotesError.body },
        ]);
    });

    it("Error for body length > 2000 characters", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send({
                title: "This is a very long note title designed",
                body: "Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for no Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyLength, field: NotesError.body },
        ]);
    });
});

describe("Fetch notes via id validation", () => {
    const app = createApp();

    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    it("Success validation", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}/note_1`)
            .send({});

        expect(response.status).toStrictEqual(200);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({
            id: "note_1",
            title: "CI pipeline rules",
            body: "All pull requests must pass lint, typecheck, tests, and build.",
            createdAt: "2026-01-21T07:20:00.000Z",
            updatedAt: "2026-01-21T07:20:00.000Z",
        });
    });

    it("Failure validation", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({});

        expect(response.statusCode).toStrictEqual(404);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });
});

describe("Fetch notes validation", () => {
    const app = createApp();

    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    it("Success validation", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}`)
            .send({});

        expect(response.status).toStrictEqual(200);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({
            items: mockResultResponseAtFetch,
            total: 3,
            limit: 20,
            offset: 0,
        });
    });

    it("Success validation", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}?limit=1&offset=1`)
            .send({});

        expect(response.status).toStrictEqual(200);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({
            items: [mockResultResponseAtFetch[1]],
            total: 3,
            limit: 1,
            offset: 1,
        });
    });
});

describe("Update notes validation", () => {
    const app = createApp();

    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    it("Success validation", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/note_3`)
            .send({
                title: "Edge cases to test before release",
                body: "Test empty inputs, long text, invalid IDs, and unexpected payloads.",
            });

        expect(response.status).toStrictEqual(200);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject({
            id: "note_3",
            title: "Edge cases to test before release",
            body: "Test empty inputs, long text, invalid IDs, and unexpected payloads.",
        });
    });

    it("Failure validation", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/note_4`)
            .send({
                title: "Edge cases to test before release",
                body: "Test empty inputs, long text, invalid IDs, and unexpected payloads.",
            });

        expect(response.statusCode).toStrictEqual(404);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });

    it("Error for missing title", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({
                body: "Total abstinence from sexual feelings",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleType, field: NotesError.title },
        ]);
    });

    it("Error for title length > 80 characters", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({
                title: "This is a very long note title designed specifically to exceed the eighty character validation limit number 3",
                body: "Total abstinence from sexual feelings",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleLength, field: NotesError.title },
        ]);
    });

    it("Error for missing body", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({
                title: "Physical Discipline",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyType, field: NotesError.body },
        ]);
    });

    it("Error for body length > 2000 characters", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({
                title: "This is a very long note title designed",
                body: "Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for no Body for note 25 Body for note 25 Body for note 25 Body for note 25 Body for note",
            });

        expect(response.statusCode).toStrictEqual(400);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyLength, field: NotesError.body },
        ]);
    });
});

describe("Delete notes validation", () => {
    const app = createApp();

    beforeEach(() => {
        __seedNotes(mockNotes);
    });

    it("Success validation", async () => {
        const response = await request(app)
            .delete(`${NotesRoutes.getDefaultRoute()}/note_1`)
            .send({});

        expect(response.statusCode).toStrictEqual(204);
        expect(response.headers["x-request-id"]).toBeTruthy();
    });

    it("Failure validation", async () => {
        const response = await request(app)
            .delete(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({});

        expect(response.statusCode).toStrictEqual(404);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });
});
