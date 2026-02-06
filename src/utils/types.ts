import { RequestHandler } from "express";

export type NullOrUndefined = null | undefined;
export type RequestHandlerParams = RequestHandler<{}, unknown, unknown>; // eslint-disable-line
