import { Logger as NestLogger } from "@nestjs/common"
import * as winston from "winston"
import "winston-daily-rotate-file"

const format = winston.format
const transports = winston.transports

// const logDir = "./storage/logs/"

// const procIndex = process.env.NODE_APP_INSTANCE === null ? 0 : process.env.NODE_APP_INSTANCE

export class LoggerService extends NestLogger {
  private readonly logger = winston.createLogger({
    exitOnError: false,
    format: format.combine(
      format.colorize({
        colors: {
          error: "red",
          info: "green",
          warn: "yellow",
          debug: "green",
          verbose: "red",
        },
      }),
      format.splat(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      format.printf((info) => {
        if (info.stack) {
          info.message = info.stack
        }
        return `${info.timestamp} [${info.pid}] ${info.level}: [${info.context || "Application"}] ${info.message
          }`
      }),
    ),
    defaultMeta: { pid: process.pid },
    transports: [
      // new transports.DailyRotateFile({
      //   dirname: logDir,
      //   filename: `${procIndex}-${process.pid}-%DATE%.log`,
      //   datePattern: "YYYY-MM-DD",
      //   zippedArchive: true,
      //   maxSize: "20m",
      //   json: false,
      //   handleExceptions: true,
      //   maxFiles: "14d",
      //   format: format.combine(format.uncolorize()),
      // }),
      new transports.Console(),
    ],
  })

  info(message: any, context?: string) {
    this.logger.log("info", {
      context,
      message: typeof message === "object" ? JSON.stringify(message) : message,
    })
  }

  log(message: any, context?: string) {
    this.logger.log("info", {
      context,
      message: typeof message === "object" ? JSON.stringify(message) : message,
    })
  }

  debug(message: any, context?: string) {
    this.logger.log("debug", {
      context,
      message: typeof message === "object" ? JSON.stringify(message) : message,
    })
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.log("error", {
      context,
      message: typeof message === "object" ? JSON.stringify(message) : message,
      trace,
    })
  }

  warn(message: any, context?: string) {
    this.logger.log("warn", {
      context,
      message: typeof message === "object" ? JSON.stringify(message) : message,
    })
  }

  verbose(message: any, context?: string) {
    this.logger.log("verbose", {
      context,
      message: typeof message === "object" ? JSON.stringify(message) : message,
    })
  }
}
