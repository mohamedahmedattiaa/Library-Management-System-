import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { UserService } from "../users/user.service.js";
import type { LoginDto, RegisterDto } from "./auth.dto.js";
import { sendSuccess, noContent } from "../../utils/response.js";
import { HttpException } from "../../utils/http-exception.js";
import { env } from "../../config/env.js";

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  private readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  register = async (
    req: Request<{}, {}, RegisterDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.authService.register(req.body);
      res.cookie("accessToken", result.accessToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", result.refreshToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      sendSuccess(res, 201, "The account is successfuly created", result);
    } catch (err) {
      next(err);
    }
  };

  login = async (
    req: Request<{}, {}, LoginDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.authService.login(req.body);
      res.cookie("accessToken", result.accessToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", result.refreshToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      sendSuccess(res, 200, "Welcome back", result);
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.user!.userId);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      noContent(res);
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.body.refreshToken ?? req.cookies?.refreshToken;
      if (!token) throw HttpException.unauthorized("Refresh token required");
      const tokens = await this.authService.refreshTokens(token);
      res.cookie("accessToken", tokens.accessToken, {
        ...this.COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      sendSuccess(res, 200, "Token refreshed", tokens);
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findById(req.user!.userId);
      sendSuccess(res, 200, "Current user", user);
    } catch (err) {
      next(err);
    }
  };
}
