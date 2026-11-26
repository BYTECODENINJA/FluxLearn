import type { RequestHandler } from "express";
import { fail } from "../utils/envelope.js";

export const notFound: RequestHandler = (req, res) => {
  res
    .status(404)
    .json(
      fail(
        "NOT_FOUND",
        `Route not found: ${req.method} ${req.originalUrl}`,
        undefined,
        req.requestId
      )
    );
};
