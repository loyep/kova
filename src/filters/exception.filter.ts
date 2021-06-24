import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { isString } from "lodash"
import { ThrottlerException } from "@nestjs/throttler"
import { LoggerService } from "@/core/logger"

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(LoggerService) private readonly logger: LoggerService

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception)
    const res = host.switchToHttp().getResponse()
    if (exception instanceof MyHttpException) {
      return res.status(HttpStatus.OK).send({
        code: exception.code,
        message: exception.message,
      })
    } else if (exception instanceof BadRequestException) {
      const errorOption = exception.getResponse() as any
      return res.status(HttpStatus.OK).send({
        code: exception.getStatus(),
        message: isString(errorOption.message) ? errorOption.message : String(errorOption.message),
      })
    } else if (exception instanceof UnauthorizedException) {
      return res.status(HttpStatus.OK).send({
        code: 401,
        message: exception.message,
      })
    } else if (exception instanceof ThrottlerException) {
      return res.status(HttpStatus.OK).send({
        code: (exception as ThrottlerException).getStatus(),
        message: "请求频繁，请稍后再试",
      })
    }
    // 对默认的 404 进行特殊处理
    return res.status(HttpStatus.OK).send({
      code: exception.getStatus(),
      message: exception.message,
    })
  }
}
