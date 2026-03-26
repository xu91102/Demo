import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      code: 400,
      message: "Invalid request parameters",
      data: {
        issues: error.flatten()
      }
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      code: error.statusCode,
      message: error.message,
      data: error.details ?? null
    });
  }

  console.error(error);

  return res.status(500).json({
    code: 500,
    message: "Internal server error",
    data: null
  });
};
