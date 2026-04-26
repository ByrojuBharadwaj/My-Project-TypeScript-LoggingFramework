import { Appender } from "../appender/Appender";
import { LogLevel } from "./LogLevel";
import { LogMessage } from "./LogMessage";

export class Logger {
  private readonly loggerName: string;
  private level: LogLevel;
  private readonly appenders: Appender[] = [];

  constructor(loggerName: string, level: LogLevel) {
    this.loggerName = loggerName;
    this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  addAppender(appender: Appender): void {
    this.appenders.push(appender);
  }

  log(level: LogLevel, message: string): void {
    if (level < this.level) return;

    const logMessage = new LogMessage(message, level, this.loggerName);
    for (const appender of this.appenders) {
      appender.append(logMessage);
    }
  }

  debug(message: string): void   { this.log(LogLevel.DEBUG, message); }
  info(message: string): void    { this.log(LogLevel.INFO, message); }
  warn(message: string): void    { this.log(LogLevel.WARNING, message); }
  error(message: string): void   { this.log(LogLevel.ERROR, message); }
  fatal(message: string): void   { this.log(LogLevel.FATAL, message); }
}
