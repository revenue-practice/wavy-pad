import { randomUUID } from "node:crypto";
import { Helper } from "../utils/helper";
import { INotesRepo } from "./repo";
import { Note, NoteEmptyResponse, NoteResult, NotesDetailedResult } from "./types";
import { Constants } from "../utils/constants";
import { NotesConstants } from "./constants";
import { NotFoundError } from "../middleware/errors";

class NotesRepo implements INotesRepo {
    async create(
        userId: string,
        title: string,
        body: string,
    ): Promise<NoteResult> {
        const note: NoteResult = {
            id: randomUUID(),
            title: title,
            body: body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: userId,
        };

        const query = `INSERT INTO ${Constants.DB_TABLES.NOTES} VALUES ($1, $2, $3, $4, $5, $6)`;
        const queryParams = [note.id, note.title, note.body, note.createdAt, note.updatedAt, note.userId];

        await Helper.executeQueryAsyncWithoutLock(query, queryParams);
        return note;
    }

    async get(userId: string, id: string): Promise<NoteResult | NoteEmptyResponse> {
        const query = `SELECT id, user_id, title, body, created_at, updated_at from ${Constants.DB_TABLES.NOTES} WHERE id = $1 and user_id = $2`;
        const queryParams = [id, userId];

        const response = await Helper.executeQueryAsyncWithoutLock(query, queryParams);
        if (response.rowCount) {
            const note: NoteResult = {
                id: response.rows[0].id,
                title: response.rows[0].title,
                body: response.rows[0].body,
                createdAt: response.rows[0].created_at,
                updatedAt: response.rows[0].updated_at,
                userId: response.rows[0].user_id,
            }

            return note;
        }

        return { message: NotesConstants.noNoteFound }
    }

    async list(
        userId: string,
        limit: number,
        offset: number,
    ): Promise<NotesDetailedResult> {   
        const query = `SELECT id, user_id, title, body, created_at, updated_at from ${Constants.DB_TABLES.NOTES} user_id = $1 LIMIT $2 OFFSET $3`;
        const response = await Helper.executeQueryAsyncWithoutLock(query, [userId, limit, offset]);

        return {
            items: response.rows,
            total: response.rowCount ?? 0,
            limit: Math.min(limit, 50),
            offset: offset,
        };
    }

    async update(
        userId: string,
        title: string,
        body: string,
        id: string,
    ): Promise<NoteResult> {
        const query = `UPDATE ${Constants.DB_TABLES.NOTES} SET title = $1, body = $2, user_id = $3 WHERE id = $4`;
        const response = await Helper.executeQueryAsyncWithoutLock(query, [title, body, userId, id]);

        if(!response.rowCount) throw new NotFoundError();

        const note: Note = {
            userId: userId,
            title: title,
            body: body,
            createdAt: response.rows[0].createdAt,
            updatedAt: new Date().toISOString(),
        };
    
        return { id: id, ...note };
    }

    async remove(userId: string, id: string): Promise<boolean> {
        const query = `DELETE FROM ${Constants.DB_TABLES.NOTES} WHERE id = $1 and user_id = $2`;
        const response = await Helper.executeQueryAsyncWithoutLock(query, [id, userId]);

        if(!response.rowCount) throw new NotFoundError();
        return true;
    }
}

export const notesRepo = new NotesRepo();
