export class AppError extends Error {
  statusCode: number;
  success: boolean;
  status: "error" | "fail";

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.status = statusCode >= 500 ? "error" : "fail";

    Error.captureStackTrace(this, this.constructor);
  }
}
