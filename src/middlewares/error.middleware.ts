import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ErrorResponse } from "./error-response";
import { ErrorCode } from "../common/error-codes";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const timestamp = new Date().toISOString();

  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        status: err.status,
        details: err.details ?? [],
        timestamp,
        path: req.originalUrl,
      },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      error: {
        code: ErrorCode.DATABASE_ERROR,
        message: "Database constraint error.",
        status: 400,
        details: [],
        timestamp,
        path: req.originalUrl,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Internal server error.",
      status: 500,
      details: [],
      timestamp,
      path: req.originalUrl,
    },
  });
};
