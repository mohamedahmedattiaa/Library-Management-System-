import { Router } from "express";
import { UserController } from "./user.controller.js";
import {
  authMiddleware,
  requireRole,
} from "../../middlewares/auth.middleware.js";
import { requireFields } from "../../middlewares/validate.middleware.js";

const router = Router();
const controller = new UserController();

router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getOne);

router.post("/", requireFields("name", "email", "password"), controller.create);

router.patch("/:id", authMiddleware, controller.update);
router.patch("/:id/password", authMiddleware, controller.changePassword);

router.delete("/:id", authMiddleware, requireRole("admin"), controller.remove);

export default router;
