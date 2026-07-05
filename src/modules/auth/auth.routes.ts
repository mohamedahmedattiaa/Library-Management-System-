import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireFields } from "../../middlewares/validate.middleware.js";

const router = Router();
const controller = new AuthController();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 attempts per 15 min
  message: { success: false, message: "Too many attempts, try again later" },
});

router.post(
  "/register",
  authLimiter,
  requireFields("name", "email", "password"),
  controller.register,
);
router.post(
  "/login",
  authLimiter,
  requireFields("email", "password"),
  controller.login,
);

router.post("/logout", authMiddleware, controller.logout);

router.post("/refresh", controller.refresh);
router.get("/me", authMiddleware, controller.me);

export default router;
