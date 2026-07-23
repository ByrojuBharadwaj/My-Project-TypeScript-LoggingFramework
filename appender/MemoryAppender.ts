import { LogMessage } from "../core/LogMessage";
import { Formatter } from "../formatter/Formatter";
import { Appender } from "./Appender";

export class MemoryAppender implements Appender {
  private readonly formatter: Formatter;
  private readonly lines: string[] = [];

  constructor(formatter: Formatter) {
    this.formatter = formatter;
  }

  append(logMessage: LogMessage): void {
    this.lines.push(this.formatter.format(logMessage));
  }

  getLines(): string[] {
    return [...this.lines];
  }

  clear(): void {
    this.lines.length = 0;
  }
}
