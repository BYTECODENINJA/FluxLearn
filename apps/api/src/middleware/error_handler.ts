import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, fail } from "../utils/envelope.js";
import { logger } from "../utils/logger.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    res
      .status(err.status)
      .json(fail(err.code, err.message, err.details, requestId));
    return;
  }

  if (err instanceof ZodError) {
    res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "Request validation failed.",
          err.flatten(),
          requestId
        )
      );
    return;
  }

  const duplicate = duplicateKeyMessage(err);
  if (duplicate) {
    res.status(409).json(fail("CONFLICT", duplicate, undefined, requestId));
    return;
  }

  logger.error({ err, requestId }, "unhandled error");
  res
    .status(500)
    .json(
      fail("INTERNAL_ERROR", "Something went wrong.", undefined, requestId)
    );
};

// Mongo duplicate-key errors (code 11000) come from the unique
// indexes - admission number, employee ID, subject code, class/section name.
// They are a user mistake, not a server fault, so they surface as 409.
const FIELD_LABELS: Record<string, string> = {
  admissionNumber: "admission number",
  employeeId: "employee ID",
  code: "code",
  name: "name",
  email: "email",
  studentId: "student",
  userId: "account",
};

function duplicateKeyMessage(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const e = err as { code?: unknown; keyPattern?: unknown };
  if (e.code !== 11000) return null;
  const fields =
    e.keyPattern && typeof e.keyPattern === "object"
      ? Object.keys(e.keyPattern).filter((k) => k !== "schoolId")
      : [];
  const label = fields
    .map((f) => FIELD_LABELS[f])
    .filter(Boolean)
    .join(" and ");
  return label
    ? `Another record already uses this ${label}.`
    : "This record already exists.";
}
