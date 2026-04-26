import { LogLevel } from "./LogLevel";



export class LogMessage {
  private readonly message: string;
  private readonly level: LogLevel;
  private readonly timestamp: Date;
  private readonly loggerName: string;
  private readonly threadName: string;

  constructor(message: string, level: LogLevel, loggerName: string) {
    this.message = message;
    this.level = level;
    this.timestamp = new Date();
    this.loggerName = loggerName;
    // Node.js is single-threaded; use a best-effort label
    this.threadName = "main";
  }

  getMessage(): string {
    return this.message;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getLoggerName(): string {
    return this.loggerName;
  }

  getThreadName(): string {
    return this.threadName;
  }
}
