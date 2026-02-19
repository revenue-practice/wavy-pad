import "express";

declare global {
    namespace Express {
        interface Request {
            noteId: string;
            userId: string;
            requestId?: string;
            pagination?: { limit: number; offset: number };
        }
    }
}

export {};
