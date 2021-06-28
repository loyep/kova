import {
  DiskHealthIndicator,
  // HttpHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  // TypeOrmHealthIndicator,
} from "@nestjs/terminus"
import { APIPrefix } from "~/constants/constants"
import { Controller, Get } from "@nestjs/common"
import { ErrorCode } from "~/constants/error"
import { MyHttpException } from "~/core/exceptions/my-http.exception"

@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    // private readonly dns: HttpHealthIndicator,
    // private readonly db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get(`${APIPrefix}health/ready`)
  @HealthCheck()
  async readiness() {
    const { status, details, error } = await this.health.check([
      () => this.memory.checkHeap("memory_heap", 200 * 1024 * 1024),
      () => this.memory.checkRSS("memory_rss", 3000 * 1024 * 1024),
      () => this.disk.checkStorage("storage", { thresholdPercent: 0.8, path: "/" }),
    ])
    if (status === "ok") {
      return details
    } else {
      throw new MyHttpException({
        code: ErrorCode.ERROR.CODE,
        message: JSON.stringify(error),
      })
    }
  }
}
