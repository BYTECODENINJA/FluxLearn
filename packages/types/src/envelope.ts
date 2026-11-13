// standard API Response Envelope

export interface pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface CursorPagination {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ResponseMeta {
  pagination?: pagination | CursorPagination;
  requestId?: string;
  error?: string;
}

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: ResponseMeta;
}

export const ERROR_CODES = [
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION_ERROR",
  "CONFLICT",
  "RATE_LIMITED",
  "INTERNAL_ERROR",
  "TENANT_MISMATCH",
  "INACTIVE_ACCOUNT",
  "EMAIL_NOT_VERIFIED",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export interface ErrorEnvelope {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export type APIResponse<T> = SuccessEnvelope<T> | ErrorEnvelope;
