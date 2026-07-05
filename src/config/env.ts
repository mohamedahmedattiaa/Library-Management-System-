import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
  return value;
};

export const env = {
  NODE_ENV: (process.env.NODE_ENV || "development") as
    "development" | "production" | "test",
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: required("MONGO_URI"),
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5174",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "cookie_secret",
};
