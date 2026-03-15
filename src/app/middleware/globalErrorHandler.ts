import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../error/AppError";
import { Prisma } from "../../generated/prisma";



export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSource: Record<string, string> = {};
  console.log(err, errorSource);
  // AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod validation error
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    err.issues.forEach((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "body";
      errorSource[path] = issue.message;
    });
  }

  // Prisma errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint failed
        statusCode = 409;
        message = "Duplicate value error";
        const field = (err.meta as any)?.target?.[0] || "unknown";
        errorSource[field] = `${field} already exists`;
        break;
      case "P2003": // Foreign key violation
        statusCode = 400;
        message = "Foreign key constraint failed";
        const fkField = (err.meta as any)?.field_name || "unknown";
        errorSource[fkField] = "Invalid reference";
        break;
      case "P2022": // Column not found
        statusCode = 400;
        message = "Column does not exist in database";
        errorSource["global"] = "Database schema mismatch";
        break;
      default:
        statusCode = 500;
        message = err.message;
        errorSource["global"] = err.message;
    }
  }

  // Prisma validation error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Prisma validation error";
    errorSource["prisma"] = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
