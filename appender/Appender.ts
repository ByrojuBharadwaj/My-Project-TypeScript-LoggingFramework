import { LogMessage } from "../core/LogMessage";

export interface Appender {
  append(logMessage: LogMessage): void;
}
