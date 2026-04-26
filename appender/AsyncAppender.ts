import { LogMessage } from "../core/LogMessage";
import { Appender } from "./Appender";

const BATCH_SIZE = 50;

export class AsyncAppender implements Appender {
  private readonly delegate: Appender;
  private readonly queue: LogMessage[] = [];
  private readonly capacity: number;
  private running = true;
  private processing = false;

  constructor(delegate: Appender, capacity: number) {
    this.delegate = delegate;
    this.capacity = capacity;

    process.on("exit", () => this.shutdown());
    process.on("SIGINT", () => { this.shutdown(); process.exit(); });
    process.on("SIGTERM", () => { this.shutdown(); process.exit(); });
  }

  append(logMessage: LogMessage): void {
    if (!this.running) return;

    if (this.queue.length >= this.capacity) {
      console.warn("AsyncAppender queue is full; dropping log message.");
      return;
    }

    this.queue.push(logMessage);

    if (!this.processing) {
      this.processBatch();
    }
  }

  private processBatch(): void {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const batch = this.queue.splice(0, BATCH_SIZE);

    setImmediate(() => {
      for (const message of batch) {
        this.delegate.append(message);
      }
      this.processBatch();
    });
  }

  shutdown(): void {
    this.running = false;
    // Flush remaining messages synchronously on shutdown
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, BATCH_SIZE);
      for (const message of batch) {
        this.delegate.append(message);
      }
    }
  }
}
