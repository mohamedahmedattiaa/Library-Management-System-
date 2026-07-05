import type { Request, Response, NextFunction } from "express";
import { BookService } from "./book.service.js";
import type { CreateBookDto, UpdateBookDto } from "./book.dto.js";
import type { PaginationQuery } from "../users/user.dto.js";
import { sendSuccess, sendPaginated, noContent } from "../../utils/response.js";

export class BookController {
  private bookservice: BookService;

  constructor() {
    this.bookservice = new BookService();
  }

  getAll = async (
    req: Request<{}, {}, {}, PaginationQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.bookservice.findAll(page, limit);
      sendPaginated(res, "Book fetched", result.data, result.meta);
    } catch (err) {
      next(err);
    }
  };
  getOne = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const book = await this.bookservice.findById(id);
      sendSuccess(res, 200, "book fetched", book);
    } catch (err) {
      next(err);
    }
  };
  search = async (
    req: Request<{}, {}, {}, { q: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query = req.query.q;
      const book = await this.bookservice.search(query);
      sendSuccess(res, 200, "Books found", book);
    } catch (err) {
      next(err);
    }
  };
  create = async (
    req: Request<{}, {}, CreateBookDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const book = await this.bookservice.create(req.body);
      sendSuccess(res, 201, "Book created", book);
    } catch (err) {
      next(err);
    }
  };
  update = async (
    req: Request<{ id: string }, {}, UpdateBookDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const book = await this.bookservice.update(id, req.body);
      sendSuccess(res, 200, "Book updated", book);
    } catch (err) {
      next(err);
    }
  };
  remove = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      await this.bookservice.remove(id);
      noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
