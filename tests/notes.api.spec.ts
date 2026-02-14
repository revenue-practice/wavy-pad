import { createApp } from "../src/app";
import { initiateDB } from "../src/db";

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { NotesRoutes } from "../src/notes/routes.constants";
import { NotesError } from "../src/notes/errors";
import { ErrorConstants } from "../src/middleware/errors.constants";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
    invalidJsonString,
    lengthyBodyNote,
    lengthyTitleNote,
    missingBodyNote,
    missingTitleNote,
    mockNote1,
    mockNote2,
    mockNote3,
    mockNote4,
} from "./mock-data";
import { Constants } from "../src/utils/constants";

const notesDataPath: string = "notes-data";
const loggerFolderPath: string = "notes-logger";

describe("POST: /notes [Insert data]", () => {
    let tempDir: string, logTempDir: string;
    let app: ReturnType<typeof createApp>;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), notesDataPath));
        logTempDir = await fs.mkdtemp(path.join(os.tmpdir(), loggerFolderPath));
        process.env.FOLDER_PATH = tempDir;
        process.env.LOGGER_PATH = logTempDir;

        app = createApp();
        await initiateDB();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        delete process.env.FOLDER_PATH;
    });

    it("Success: Insert Data[note_1]", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send(mockNote1);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[201]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject(mockNote1);
    });

    it("Success: Insert Data[note_2]", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send(mockNote2);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[201]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject(mockNote2);
    });

    it("Success: Insert Data[note_3]", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send(mockNote3);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[201]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject(mockNote3);
    });

    it("Error: Invalid JSON", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .set("Content-Type", "application/json")
            .send(invalidJsonString); // missing closing }

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.header["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({ message: "Invalid Json" });
    });

    it("Error: Missing title", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send(missingTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleType, field: NotesError.title },
        ]);
    });

    it("Error: Missing body", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send(missingBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyType, field: NotesError.body },
        ]);
    });

    it("Error: Title length > 80", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send(lengthyTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleLength, field: NotesError.title },
        ]);
    });

    it("Error: Body length > 2000", async () => {
        const response = await request(app)
            .post(NotesRoutes.getDefaultRoute())
            .send(lengthyBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyLength, field: NotesError.body },
        ]);
    });
});

describe("GET: /:id [Fetch note via id]", () => {
    let tempDir: string, logTempDir: string;
    let app: ReturnType<typeof createApp>;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), notesDataPath));
        logTempDir = await fs.mkdtemp(path.join(os.tmpdir(), loggerFolderPath));
        process.env.FOLDER_PATH = tempDir;
        process.env.LOGGER_PATH = logTempDir;

        app = createApp();
        await initiateDB();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        delete process.env.FOLDER_PATH;
    });

    it("Error: Not Found", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}/note_4`)
            .send({});

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[404]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });
});

describe("GET: / [List Notes]", () => {
    let tempDir: string, logTempDir: string;
    let app: ReturnType<typeof createApp>;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), notesDataPath));
        logTempDir = await fs.mkdtemp(path.join(os.tmpdir(), loggerFolderPath));
        process.env.FOLDER_PATH = tempDir;
        process.env.LOGGER_PATH = logTempDir;

        app = createApp();
        await initiateDB();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        delete process.env.FOLDER_PATH;
    });

    it("Success: Fetch List", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}`)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject({
            items: [mockNote3, mockNote2, mockNote1],
            total: 3,
            limit: 20,
            offset: 0,
        });
    });

    it("Success: Fetch List [Limit 1]", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}?limit=1`)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject({
            items: [mockNote3],
            total: 3,
            limit: 1,
            offset: 0,
        });
    });

    it("Success: Fetch List [Limit 1 Offset 1]", async () => {
        const response = await request(app)
            .get(`${NotesRoutes.getDefaultRoute()}?limit=1&offset=1`)
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toMatchObject({
            items: [mockNote2],
            total: 3,
            limit: 1,
            offset: 1,
        });
    });
});

describe("Update notes validation", () => {
    let tempDir: string, logTempDir: string;
    let app: ReturnType<typeof createApp>;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), notesDataPath));
        logTempDir = await fs.mkdtemp(path.join(os.tmpdir(), loggerFolderPath));
        process.env.FOLDER_PATH = tempDir;
        process.env.LOGGER_PATH = logTempDir;

        app = createApp();
        await initiateDB();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        delete process.env.FOLDER_PATH;
    });

    it("Error: Not Found", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/note_4`)
            .send(mockNote4);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[404]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });

    it("Error: Missing title", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send(missingTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleType, field: NotesError.title },
        ]);
    });

    it("Error: Missing body", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send(missingBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyType, field: NotesError.body },
        ]);
    });

    it("Error: Title length > 80", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send(lengthyTitleNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidTitleLength, field: NotesError.title },
        ]);
    });

    it("Error: Body length > 2000", async () => {
        const response = await request(app)
            .put(`${NotesRoutes.getDefaultRoute()}/123`)
            .send(lengthyBodyNote);

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[400]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: NotesError.invalidBodyLength, field: NotesError.body },
        ]);
    });
});

describe("Delete notes validation", () => {
    let tempDir: string, logTempDir: string;
    let app: ReturnType<typeof createApp>;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), notesDataPath));
        logTempDir = await fs.mkdtemp(path.join(os.tmpdir(), loggerFolderPath));
        process.env.FOLDER_PATH = tempDir;
        process.env.LOGGER_PATH = logTempDir;

        app = createApp();
        await initiateDB();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
        delete process.env.FOLDER_PATH;
    });

    it("Failure validation", async () => {
        const response = await request(app)
            .delete(`${NotesRoutes.getDefaultRoute()}/123`)
            .send({});

        expect(response.statusCode).toStrictEqual(Constants.STATUS_CODES[404]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual([
            { message: ErrorConstants.notFound },
        ]);
    });
});
