import type {
  SuccessEnvelope,
  ErrorEnvelope,
  ErrorCode,
  ResponseMeta,
} from "@fluxlearn/types/envelope";

export function ok<T>(data: T, meta?: ResponseMeta): SuccessEnvelope<T> {
  return meta ? { success: true, data, meta } : { success: true, data };
}

export function fail(
  code: ErrorCode,
  message: string,
  details?: unknown,
  requestId?: string
): ErrorEnvelope {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      ...(requestId ? { requestId } : {}),
    },
  };
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    status = 400,
    details?: unknown
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
