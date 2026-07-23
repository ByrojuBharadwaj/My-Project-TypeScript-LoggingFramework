import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { ConsoleAppender } from "./appender/ConsoleAppender";
import { MemoryAppender } from "./appender/MemoryAppender";
import { LogLevel } from "./core/LogLevel";
import { Logger } from "./core/Logger";
import { DefaultFormatter } from "./formatter/DefaultFormatter";

const app = express();
app.use(express.json());

const LEVEL_MAP: Record<string, LogLevel> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARNING,
  warning: LogLevel.WARNING,
  error: LogLevel.ERROR,
  fatal: LogLevel.FATAL,
};

function createLogger(name: string, level: LogLevel = LogLevel.DEBUG): {
  logger: Logger;
  memory: MemoryAppender;
} {
  const formatter = new DefaultFormatter();
  const memory = new MemoryAppender(formatter);
  const logger = new Logger(name, level);
  logger.addAppender(memory);
  logger.addAppender(new ConsoleAppender(formatter));
  return { logger, memory };
}

app.get("/", (_req: Request, res: Response) => {
  const indexPath = path.join(process.cwd(), "public", "index.html");
  res.type("html").send(fs.readFileSync(indexPath, "utf8"));
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    framework: "TypeScript Logging Framework",
    levels: Object.keys(LEVEL_MAP).filter((k) => k !== "warning"),
  });
});

app.get("/api/demo", (_req: Request, res: Response) => {
  const { logger, memory } = createLogger("Demo");

  logger.debug("Application starting up");
  logger.info("Connected to configuration service");
  logger.warn("Cache miss for key user:42");
  logger.error("Failed to process payment for order #9182");
  logger.fatal("Unrecoverable database connection loss");

  res.json({
    logger: "Demo",
    count: memory.getLines().length,
    logs: memory.getLines(),
  });
});

app.post("/api/log", (req: Request, res: Response) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const levelKey = String(req.body?.level ?? "info").toLowerCase();
  const loggerName =
    typeof req.body?.logger === "string" && req.body.logger.trim()
      ? req.body.logger.trim()
      : "ApiLogger";

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const level = LEVEL_MAP[levelKey];
  if (!level) {
    res.status(400).json({
      error: "invalid level",
      allowed: ["debug", "info", "warn", "error", "fatal"],
    });
    return;
  }

  const { logger, memory } = createLogger(loggerName, LogLevel.DEBUG);
  logger.log(level, message);

  res.json({
    logger: loggerName,
    level: levelKey,
    logs: memory.getLines(),
  });
});

export default app;

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Logging framework demo listening on http://localhost:${port}`);
  });
}
