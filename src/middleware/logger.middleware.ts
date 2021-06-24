import { LoggerService } from "@/core/logger"
import { Inject, Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response } from 'express'
import { uniqueId } from 'lodash'
import { v4 as uuidv4 } from 'uuid';

const REQUEST_ID = 'request-id'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

@Inject(LoggerService) private readonly logger: LoggerService

async use(request: Request, response: Response, next) {
    const req: Request = request
    const { url, method, params = {}, query = {} } = request

    // if (this.configService.server.allowOrigins.indexOf(req.headers.origin) >= 0) {
    //   res.header("Access-Control-Allow-Origin", req.headers.origin)
    // }
    // res.header("Access-Control-Allow-Methods", "OPTIONS,HEAD,PUT,POST,GET,DELETE")
    const now = Date.now();
    const uuid = uuidv4();
    const uid = uniqueId()
    if (!req.header(REQUEST_ID)) {
        req.headers[REQUEST_ID] = `${uid}${uuid}`;
    }
    this.logger.log(`Before: ${method} ${url} with :
    params: ${JSON.stringify(params)}, with query: ${JSON.stringify(query)}`)
    await next();
    this.logger.log(`After: ${method} ${url} took ${Date.now() - now}ms`)
  }
}
