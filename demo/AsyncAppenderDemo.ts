import { AsyncAppender } from "../appender/AsyncAppender";
import { ConsoleAppender } from "../appender/ConsoleAppender";
import { FileAppender } from "../appender/FileAppender";
import { LogLevel } from "../core/LogLevel";
import { LoggerManager } from "../core/LoggerManager";
import { DefaultFormatter } from "../formatter/DefaultFormatter";

async function main(): Promise<void> {
  const logger = LoggerManager.getInstance().getLogger("AsyncAppenderDemo");
  logger.setLevel(LogLevel.DEBUG);

  const formatter = new DefaultFormatter();

  const fileAppender = new FileAppender("async-demo.log", formatter);
  const consoleAppender = new ConsoleAppender(formatter);
  const asyncAppender = new AsyncAppender(fileAppender, 10000);

  logger.addAppender(consoleAppender);  // Sync console
  logger.addAppender(asyncAppender);    // Async file

  console.log("Starting async logging demo...");

  // Simulate concurrent tasks using promises (JS is single-threaded,
  // so we interleave by yielding with setImmediate between iterations)
  const task = async (workerName: string): Promise<void> => {
    for (let i = 1; i <= 50; i++) {
      logger.debug(`Message ${i} from ${workerName}`);
      // Yield to the event loop so other "workers" can run
      await new Promise<void>((resolve) => setImmediate(resolve));
    }
  };

  const start = Date.now();

  await Promise.all([
    task("Worker-1"),
    task("Worker-2"),
    task("Worker-3"),
  ]);

  const end = Date.now();
  console.log(`Logging calls completed in ${end - start} ms`);

  // Give async worker time to flush remaining logs
  await new Promise<void>((resolve) => setTimeout(resolve, 2000));

  console.log("Async logging demo finished.");
}

main().catch(console.error);
