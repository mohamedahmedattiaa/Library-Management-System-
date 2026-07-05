import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import authorRoutes from "../modules/authors/author.routes.js";
import categoryRoutes from "../modules/categories/category.routes.js";
import bookRoutes from "../modules/books/book.routes.js";
import borrowRoutes from "../modules/borrows/borrow.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/authors", authorRoutes);
router.use("/categories", categoryRoutes);
router.use("/books", bookRoutes);
router.use("/borrows", borrowRoutes);

export default router;
