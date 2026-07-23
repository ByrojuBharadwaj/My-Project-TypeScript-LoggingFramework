import * as fs from "fs";
import { LogMessage } from "../core/LogMessage";
import { Formatter } from "../formatter/Formatter";
import { Appender } from "./Appender";

export class FileAppender implements Appender {
  private readonly formatter: Formatter;
  private readonly stream: fs.WriteStream;

  constructor(filePath: string, formatter: Formatter) {
    this.formatter = formatter;
    this.stream = fs.createWriteStream(filePath, { flags: "a" });

    process.on("exit", () => this.shutdown());
    process.on("SIGINT", () => { this.shutdown(); process.exit(); });
    process.on("SIGTERM", () => { this.shutdown(); process.exit(); });
  }

  append(logMessage: LogMessage): void {
    const line = this.formatter.format(logMessage) + "\n";
    this.stream.write(line, (err) => {
      if (err) console.error("FileAppender write error:", err);
    });
  }

  private shutdown(): void {
    this.stream.end();
  }
}
