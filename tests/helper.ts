import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import { createApp } from "../src/app";
import { initiateDB } from "../src/db";

const notesDataPath: string = "notes-data";
const loggerFolderPath: string = "notes-logger";

export async function beforeEachHelper() {
    const tempDir: string = await fs.mkdtemp(
        path.join(os.tmpdir(), notesDataPath),
    );
    const logTempDir: string = await fs.mkdtemp(
        path.join(os.tmpdir(), loggerFolderPath),
    );
    const app = createApp();

    process.env.FOLDER_PATH = tempDir;
    process.env.LOGGER_PATH = logTempDir;
    await initiateDB();

    return { tempDir, logTempDir, app };
}

export async function afterEachHelper(ctx: { tempDir: string }) {
    await fs.rm(ctx.tempDir, { recursive: true, force: true });

    delete process.env.FOLDER_PATH;
    delete process.env.LOGGER_PATH;
}
