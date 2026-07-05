import { Router } from "express";
import {
  authMiddleware,
  requireRole,
} from "../../middlewares/auth.middleware.js";
import { requireFields } from "../../middlewares/validate.middleware.js";
import { AuthorController } from "./author.controller.js";

const router = Router();
const controller = new AuthorController();

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  requireFields("name"),
  controller.create,
);

router.patch("/:id", authMiddleware, requireRole("admin"), controller.update);
router.delete("/:id", authMiddleware, requireRole("admin"), controller.remove);

export default router;
