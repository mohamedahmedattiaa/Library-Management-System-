import { Router } from "express";
import {
  authMiddleware,
  requireRole,
} from "../../middlewares/auth.middleware.js";
import { requireFields } from "../../middlewares/validate.middleware.js";
import { BorrowController } from "./borrow.controller.js";

const router = Router();
const controller = new BorrowController();

router.get("/my", authMiddleware ,controller.myBorrows);
router.get("/history",authMiddleware, controller.myHistory);
router.get("/overdue",authMiddleware,requireRole('admin'), controller.overdue);
router.get("/",authMiddleware,requireRole('admin'),controller.getAll)
router.post(
  "/",
  authMiddleware,
  requireFields("bookId"),
  controller.borrow,
);

router.patch("/:id/return", authMiddleware, controller.returnbook);


export default router;
