import { Router } from "express";
import {
  authMiddleware,
  requireRole,
} from "../../middlewares/auth.middleware.js";
import { requireFields } from "../../middlewares/validate.middleware.js";
import { BookController } from "./book.controller.js";

const router = Router();
const controller = new BookController();

router.get("/", controller.getAll);
router.get("/search", controller.search);
router.get("/:id", controller.getOne);

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  requireFields("title", "isbn", "author", "category", "totalCopies"),
  controller.create,
);

router.patch("/:id", authMiddleware, requireRole("admin"), controller.update);
router.delete("/:id", authMiddleware, requireRole("admin"), controller.remove);

export default router;
