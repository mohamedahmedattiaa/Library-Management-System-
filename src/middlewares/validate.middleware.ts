import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/http-exception.js";

export const requireFields = (...fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body || {};

    const missing = fields.filter((field) => {
      const value = body[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
      return next(
        HttpException.badRequest(
          `Missing required fields: ${missing.join(", ")}`,
        ),
      );
    }
    next();
  };
};
