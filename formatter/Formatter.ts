import { LogMessage } from "../core/LogMessage";

export interface Formatter {
  format(logMessage: LogMessage): string;
}
