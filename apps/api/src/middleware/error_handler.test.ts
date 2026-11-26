import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "./error_handler.js";

function run(err: unknown) {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  errorHandler(
    err,
    { requestId: "req-1" } as unknown as Request,
    res as unknown as Response,
    (() => undefined) as NextFunction
  );
  return {
    status: res.status.mock.calls[0]?.[0] as number,
    body: res.json.mock.calls[0]?.[0] as {
      success: boolean;
      error: { code: string; message: string };
    },
  };
}

describe("errorHandler - duplicate keys", () => {
  it("maps a duplicate admission number to 409 CONFLICT", () => {
    const { status, body } = run({
      code: 11000,
      keyPattern: { schoolId: 1, admissionNumber: 1 },
    });
    expect(status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("CONFLICT");
    expect(body.error.message).toBe(
      "Another record already uses this admission number."
    );
  });

  it("names the field for class / section names", () => {
    const { body } = run({
      code: 11000,
      keyPattern: { schoolId: 1, classId: 1, name: 1 },
    });
    expect(body.error.message).toBe("Another record already uses this name.");
  });

  it("falls back to a generic message for unknown keys", () => {
    const { status, body } = run({
      code: 11000,
      keyPattern: { schoolId: 1, foo: 1 },
    });
    expect(status).toBe(409);
    expect(body.error.message).toBe("This record already exists.");
  });

  it("still treats other errors as 500", () => {
    const { status, body } = run(new Error("boom"));
    expect(status).toBe(500);
    expect(body.error.code).toBe("INTERNAL_ERROR");
  });
});
