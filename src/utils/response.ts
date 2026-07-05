import type { Response } from "express";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T[],
  meta: PaginationMeta,
): Response => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const noContent = (res: Response): Response => {
  return res.status(204).send();
};
