import type { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service.js";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from "./category.dto.js";
import type { PaginationQuery } from "../users/user.dto.js";
import { sendSuccess, sendPaginated, noContent } from "../../utils/response.js";

export class CategoryController {
  private categoryservice: CategoryService;

  constructor() {
    this.categoryservice = new CategoryService();
  }

  getAll = async (
    req: Request<{}, {}, {}, PaginationQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.categoryservice.findAll(page, limit);
      sendPaginated(res, "Category fetched", result.data, result.meta);
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
      const category = await this.categoryservice.findById(id);
      sendSuccess(res, 200, "Category fetched", category);
    } catch (err) {
      next(err);
    }
  };
  create = async (
    req: Request<{}, {}, CreateCategoryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const category = await this.categoryservice.create(req.body);
      sendSuccess(res, 201, "Category created", category);
    } catch (err) {
      next(err);
    }
  };
  update = async (
    req: Request<{ id: string }, {}, UpdateCategoryDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const category = await this.categoryservice.update(id, req.body);
      sendSuccess(res, 200, "Category updated", category);
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
      await this.categoryservice.remove(id);
      noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
