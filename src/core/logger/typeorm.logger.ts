import { LoggerService } from "./logger.service"
import { QueryRunner } from "typeorm"
import { Logger } from "typeorm/logger/Logger"
import { PlatformTools } from "typeorm/platform/PlatformTools"

export class TypeOrmLoggerFormatter {
  constructor(private readonly highlightEnabled: boolean = false) {}

  formatQuery(query: string, parameters?: unknown[]): string {
    const q = this.formatQueryWithParameter(query, parameters)
    return `query: ${q}`
  }

  formatQueryError(_error: string | Error, query: string, parameters?: unknown[]): string {
    const q = this.formatQueryWithParameter(query, parameters)
    return `query failed: ${q}`
  }

  formatQuerySlow(time: number, query: string, parameters?: unknown[]): string {
    const q = this.formatQueryWithParameter(query, parameters)
    return `query is slow: execution time = ${time}, query = ${q}`
  }

  private formatQueryWithParameter(query: string, parameters?: unknown[]): string {
    const result =
      parameters && parameters.length
        ? `${query} -- PARAMETERS: ${JSON.stringify(parameters)}`
        : query
    return this.highlightEnabled ? PlatformTools.highlightSql(result) : result
  }
}

export class TypeOrmLogger implements Logger {
  protected readonly formatter: TypeOrmLoggerFormatter
  private readonly logger: LoggerService

  constructor() {
    this.formatter = new TypeOrmLoggerFormatter(false)
    this.logger = new LoggerService()
  }

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.info(this.formatter.formatQuery(query, parameters), "QueryRunner")
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(this.formatter.formatQueryError(error, query, parameters), "", "QueryRunner")
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.info(`[${time}ms] ${this.formatter.formatQuery(query, parameters)}`, "QueryRunnerSlow")
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    console.log(message)
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, _queryRunner?: QueryRunner) {
    console.log(message)
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
    // this.logger[level](message, "QueryRunner")
  }
}
