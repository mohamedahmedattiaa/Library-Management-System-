import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function bootstrap(): Promise<void> {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  const shutdown = (signal: string): void => {
    console.log(`\n ${signal} received — shutting down`);

    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    shutdown("unhandledRejection");
  });
}

bootstrap();
