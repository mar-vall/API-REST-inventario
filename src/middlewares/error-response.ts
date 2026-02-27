import { ErrorCode } from "../common/error-codes";

export class ErrorResponse extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public status: number,
    public details?: { field?: string; issue: string }[]
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
