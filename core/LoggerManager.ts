import { Logger } from "./Logger";
import { LogLevel } from "./LogLevel";

export class LoggerManager {
  private static readonly instance = new LoggerManager();
  private readonly loggers = new Map<string, Logger>();

  private constructor() {}

  static getInstance(): LoggerManager {
    return LoggerManager.instance;
  }

  getLogger(name: string): Logger {
    if (!this.loggers.has(name)) {
      this.loggers.set(name, new Logger(name, LogLevel.INFO));
    }
    return this.loggers.get(name)!;
  }
}
