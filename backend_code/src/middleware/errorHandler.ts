import { Request, Response, NextFunction } from "express";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 ERROR →", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  // If error is instance of Error
  if (err instanceof Error) {
    message = err.message;
  }

  // If custom object with statusCode
  if (typeof err === "object" && err !== null && "statusCode" in err) {
    // @ts-ignore
    statusCode = err.statusCode || 500;
    // @ts-ignore
    message = err.message || message;
  }

  // thrown string → message
  if (typeof err === "string") {
    message = err;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" && err instanceof Error ? err.stack : undefined,
  });
};

export default errorHandler;
