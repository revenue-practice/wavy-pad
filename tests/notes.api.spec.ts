import { createApp } from "../src/app";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { NotesRoutes } from "../src/notes/routes.constants";
import { NotesError } from "../src/notes/errors";
import { ErrorConstants } from "../src/middleware/errors.constants";
import {
    invalidJsonString,
    lengthyBodyNote,
    lengthyTitleNote,
    missingBodyNote,
    missingTitleNote,
    mockHeaders,
    mockNote1,
    mockNote2,
    mockNote3,
    mockNote4,
    mockNote7,
    mockNote8,
} from "./mock-data";
import { Constants } from "../src/utils/constants";
import { beforeEachHelper, afterEachHelper } from "./helper";

describe("POST:GET:PUT:DELETE [request-id]", () => {
    let ctx: {
        tempDir: string;
        logTempDir: string;
        app: ReturnType<typeof createApp>;
    };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Success: Check request-id", async () => {
        const postResponse = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user2IdHeader)
            .send(mockNote8);

        const getResponse = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}/noteX`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        const putResponse = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/noteX`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(mockNote4);

        const deleteResponse = await request(ctx.app)
            .delete(`${NotesRoutes.getDefaultRoute()}/noteX`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(postResponse.statusCode).toBe(201);
        expect(getResponse.statusCode).toBe(404);
        expect(putResponse.statusCode).toBe(404);
        expect(deleteResponse.statusCode).toBe(404);

        expect(postResponse.headers["x-request-id"]).toBeTruthy();
        expect(getResponse.headers["x-request-id"]).toBeTruthy();
        expect(putResponse.headers["x-request-id"]).toBeTruthy();
        expect(deleteResponse.headers["x-request-id"]).toBeTruthy();
    });
});

describe("POST: /notes [Insert data]", () => {
    let ctx: {
        tempDir: string;
        logTempDir: string;
        app: ReturnType<typeof createApp>;
    };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Success: Insert Data[note_1]", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(mockNote1);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[201]);
        expect(response.body).toMatchObject(mockNote1);
    });

    it("Success: Insert Data[note_2]", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(mockNote2);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[201]);
        expect(response.body).toMatchObject(mockNote2);
    });

    it("Error: Invalid JSON", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set("Content-Type", "application/json")
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(invalidJsonString); // missing closing }

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.header["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({ message: "Invalid Json" });
    });

    it("Error: Missing title", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(missingTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleType, field: NotesError.title },
        ]);
    });

    it("Error: Missing body", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(missingBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyType, field: NotesError.body },
        ]);
    });

    it("Error: Title length > 80", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(lengthyTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleLength, field: NotesError.title },
        ]);
    });

    it("Error: Body length > 2000", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(lengthyBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyLength, field: NotesError.body },
        ]);
    });

    it("Error: Unauthorised", async () => {
        const response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .send(mockNote1);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[401]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.unauthorised },
        ]);
    });
});

describe("POST: /notes [Check for multiple users]", () => {
    let ctx: {
        tempDir: string;
        logTempDir: string;
        app: ReturnType<typeof createApp>;
    };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Success & Error: Multi user testing", async () => {
        const notesId = {
            note3: "",
            note7: "",
        };

        const note3Response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(mockNote3);

        const note7Response = await request(ctx.app)
            .post(NotesRoutes.getDefaultRoute())
            .set(mockHeaders.userId, mockHeaders.user2IdHeader)
            .send(mockNote7);

        expect(note3Response.statusCode).toStrictEqual(
            Constants.STATUS_CODES[201],
        );
        expect(note3Response.body).toMatchObject(mockNote3);

        expect(note7Response.statusCode).toStrictEqual(
            Constants.STATUS_CODES[201],
        );
        expect(note7Response.body).toMatchObject(mockNote7);

        notesId.note3 = note3Response.body.id;
        notesId.note7 = note7Response.body.id;

        const getUser2Note = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}/${notesId.note7}`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(getUser2Note.statusCode).toStrictEqual(
            Constants.STATUS_CODES[404],
        );
        expect(getUser2Note.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);

        const updateUser2Note = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/${notesId.note7}`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(mockNote4);

        expect(updateUser2Note.statusCode).toStrictEqual(
            Constants.STATUS_CODES[404],
        );
        expect(updateUser2Note.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);

        const deleteUser2Note = await request(ctx.app)
            .delete(`${NotesRoutes.getDefaultRoute()}/${notesId.note7}`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(deleteUser2Note.statusCode).toStrictEqual(
            Constants.STATUS_CODES[404],
        );
        expect(deleteUser2Note.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });
});

describe("GET: /:id [Fetch note via id]", () => {
    let ctx: {
        tempDir: string;
        logTempDir: string;
        app: ReturnType<typeof createApp>;
    };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Error: Not Found", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}/note_4`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[404]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });

    it("Error: Unauthorised", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}/note_4`)
            .send({});

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[401]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.unauthorised },
        ]);
    });
});

describe("GET: / [List Notes]", () => {
    let ctx: {
        tempDir: string;
        logTempDir: string;
        app: ReturnType<typeof createApp>;
    };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Success: Fetch List user 1", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.body).toMatchObject({
            items: [mockNote3, mockNote2, mockNote1],
            total: 3,
            limit: 20,
            offset: 0,
        });
    });

    it("Success: Fetch List user 2", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}`)
            .set(mockHeaders.userId, mockHeaders.user2IdHeader)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.body).toMatchObject({
            items: [mockNote7, mockNote8],
            total: 2,
            limit: 20,
            offset: 0,
        });
    });

    it("Success: Fetch List [Limit 1] user 1", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}?limit=1`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.body).toMatchObject({
            items: [mockNote3],
            total: 3,
            limit: 1,
            offset: 0,
        });
    });

    it("Success: Fetch List [Limit 1] user 2", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}?limit=1`)
            .set(mockHeaders.userId, mockHeaders.user2IdHeader)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.body).toMatchObject({
            items: [mockNote7],
            total: 2,
            limit: 1,
            offset: 0,
        });
    });

    it("Success: Fetch List [Limit 1 Offset 1] user 1", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}?limit=1&offset=1`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.body).toMatchObject({
            items: [mockNote2],
            total: 3,
            limit: 1,
            offset: 1,
        });
    });

    it("Error: Unauthorised", async () => {
        const response = await request(ctx.app)
            .get(`${NotesRoutes.getDefaultRoute()}?limit=1&offset=1`)
            .send({});

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[401]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.unauthorised },
        ]);
    });
});

describe("Update notes validation", () => {
    let ctx: {
        tempDir: string;
        logTempDir: string;
        app: ReturnType<typeof createApp>;
    };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Error: Not Found", async () => {
        const response = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/note_4`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(mockNote4);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[404]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });

    it("Error: Missing title", async () => {
        const response = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(missingTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleType, field: NotesError.title },
        ]);
    });

    it("Error: Missing body", async () => {
        const response = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(missingBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyType, field: NotesError.body },
        ]);
    });

    it("Error: Title length > 80", async () => {
        const response = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(lengthyTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleLength, field: NotesError.title },
        ]);
    });

    it("Error: Body length > 2000", async () => {
        const response = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send(lengthyBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyLength, field: NotesError.body },
        ]);
    });

    it("Error: Unauthorised", async () => {
        const response = await request(ctx.app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send(lengthyBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[401]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.unauthorised },
        ]);
    });
});

describe("Delete notes validation", () => {
    let ctx: {
        tempDir: string;
        logTempDir: string;
        app: ReturnType<typeof createApp>;
    };

    beforeEach(async () => {
        ctx = await beforeEachHelper();
    });

    afterEach(async () => {
        await afterEachHelper(ctx);
    });

    it("Error: Not Found", async () => {
        const response = await request(ctx.app)
            .delete(`${NotesRoutes.getDefaultRoute()}/123`)
            .set(mockHeaders.userId, mockHeaders.user1IdHeader)
            .send({});

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[404]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });

    it("Error: Unauthorised", async () => {
        const response = await request(ctx.app)
            .delete(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({});

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[401]);
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.unauthorised },
        ]);
    });
});
