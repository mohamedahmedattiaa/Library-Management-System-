import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  PaginationQuery,
} from "./user.dto.js";
import { sendSuccess, sendPaginated, noContent } from "../../utils/response.js";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAll = async (
    req: Request<{}, {}, {}, PaginationQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await this.userService.findAll(page, limit);
      sendPaginated(res, "Users fetched", result.data, result.meta);
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
      const user = await this.userService.findById(id);
      sendSuccess(res, 200, "User fetched", user);
    } catch (err) {
      next(err);
    }
  };
  create = async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = await this.userService.create(req.body);
      sendSuccess(res, 201, "User created", user);
    } catch (err) {
      next(err);
    }
  };
  update = async (
    req: Request<{ id: string }, {}, UpdateUserDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      const user = await this.userService.update(id, req.body);
      sendSuccess(res, 200, "User updated", user);
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
      await this.userService.remove(id);
      noContent(res);
    } catch (err) {
      next(err);
    }
  };
  changePassword = async (
    req: Request<{ id: string }, {}, ChangePasswordDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      await this.userService.changePassword(id, req.body);
      sendSuccess(res, 200, "Password changed");
    } catch (err) {
      next(err);
    }
  };
}
