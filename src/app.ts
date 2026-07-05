import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { HttpException } from "./utils/http-exception.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser(env.COOKIE_SECRET));

app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", router);

app.use((_req, _res, next) => next(HttpException.notFound("Route not found")));

app.use(errorMiddleware);

export default app;
