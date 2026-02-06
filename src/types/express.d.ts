import "express";

declare global {
    namespace Express {
        interface Request {
            noteId: string;
            requestId?: string;
            pagination?: { limit: number; offset: number };
        }
    }
}

export {};
