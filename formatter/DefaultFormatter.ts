import { LogLevel } from "../core/LogLevel";
import { LogMessage } from "../core/LogMessage";
import { Formatter } from "./Formatter";

export class DefaultFormatter implements Formatter {
  format(logMessage: LogMessage): string {
    const ts = logMessage.getTimestamp();
    const pad = (n: number, width = 2): string => String(n).padStart(width, "0");

    const formatted =
      `${pad(ts.getDate())}-${pad(ts.getMonth() + 1)}-${ts.getFullYear()} ` +
      `${pad(ts.getHours())}:${pad(ts.getMinutes())}:${pad(ts.getSeconds())}`;

    const levelName = LogLevel[logMessage.getLevel()];

    return (
      `${formatted} [${logMessage.getThreadName()}] ${logMessage.getLoggerName()} ` +
      `${levelName} - ${logMessage.getMessage()}`
    );
  }
}
