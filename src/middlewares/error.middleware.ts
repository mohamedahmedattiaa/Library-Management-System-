import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/http-exception.js";
import { env } from "../config/env.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof HttpException) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }

  if ("code" in err && (err as any).code === 11000) {
    res
      .status(409)
      .json({ success: false, message: "Resource already exists" });
    return;
  }

  if (err.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid ID format" });
    return;
  }

  if (err.name === "ValidationError") {
    res.status(422).json({ success: false, message: err.message });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};
