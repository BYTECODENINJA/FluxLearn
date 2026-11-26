import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export function requestId(): RequestHandler {
  return (req, res, next) => {
    const incoming = req.header("x-request-id");
    const id =
      incoming && /^[\w-]{8,128}$/u.test(incoming) ? incoming : randomUUID();
    req.requestId = id;
    res.setHeader("x-request-id", id);
    next();
  };
}
