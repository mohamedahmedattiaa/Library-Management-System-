import type { Request, Response, NextFunction } from "express";
import { AuthorService } from "./author.service.js";
import type { CreateAuthorDto, UpdateAuthorDto } from "./author.dto.js";
import type { PaginationQuery } from "../users/user.dto.js";
import { sendSuccess, sendPaginated, noContent } from "../../utils/response.js";

export class AuthorController {
  private authorService: AuthorService;

  constructor() {
    this.authorService = new AuthorService();
  }
  getAll = async (
    req: Request<{}, {}, {}, PaginationQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.authorService.findAll(page, limit);
      sendPaginated(res, "Authors fetched", result.data, result.meta);
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
      const author = await this.authorService.findById(id);
      sendSuccess(res, 200, "Author fetched", author);
    } catch (err) {
      next(err);
    }
  };
  create = async (
    req: Request<{}, {}, CreateAuthorDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const author = await this.authorService.create(req.body);
      sendSuccess(res, 201, "Author created", author);
    } catch (err) {
      next(err);
    }
  };
  update = async (
    req: Request<{ id: string }, {}, UpdateAuthorDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const author = await this.authorService.update(id, req.body);
      sendSuccess(res, 200, "Author updated", author);
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
      await this.authorService.remove(id);
      noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
