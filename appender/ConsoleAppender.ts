import { LogMessage } from "../core/LogMessage";
import { Formatter } from "../formatter/Formatter";
import { Appender } from "./Appender";

export class ConsoleAppender implements Appender {
  private readonly formatter: Formatter;

  constructor(formatter: Formatter) {
    this.formatter = formatter;
  }

  append(logMessage: LogMessage): void {
    console.log(this.formatter.format(logMessage));
  }
}
