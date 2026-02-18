import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    console.error("UNEXPECTED ERROR:", err);

    error = new AppError("Internal Server Error", 500);
  }

  return res.status(error.statusCode).json({
    code: error.statusCode,
    status: error.status,
    success: error.success,
    message: error.message,
  });
}
