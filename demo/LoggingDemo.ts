import { ConsoleAppender } from "../appender/ConsoleAppender";
import { LogLevel } from "../core/LogLevel";
import { LoggerManager } from "../core/LoggerManager";
import { DefaultFormatter } from "../formatter/DefaultFormatter";

const logger = LoggerManager.getInstance().getLogger("LoggingDemo");

logger.addAppender(new ConsoleAppender(new DefaultFormatter()));
logger.setLevel(LogLevel.FATAL);

logger.fatal("This is an error message");
