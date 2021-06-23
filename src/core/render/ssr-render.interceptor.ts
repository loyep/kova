import { CallHandler, ExecutionContext, Inject, Injectable, InternalServerErrorException, NestInterceptor, Optional } from "@nestjs/common";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { Request, Response } from 'express-serve-static-core';
import { Observable, of, firstValueFrom } from "rxjs";
import { RedirectException } from "../exceptions/redirect.exception";
import { render } from "ssr-core-react";
import { Readable, Stream } from 'stream';
import { SSR_RENDER_METADATA } from "./ssr-render.constants";
import { CacheService } from "../cache";

const REFLECTOR = 'Reflector';
const HTTP_ADAPTER_HOST = 'HttpAdapterHost';

export interface SsrRenderOptions {
  stream?: boolean;
}

@Injectable()
export class SsrRenderInterceptor implements NestInterceptor {

  @Inject(REFLECTOR) protected readonly reflector: Reflector

  @Optional()
  @Inject(CacheService) private cache: CacheService

  @Optional()
  @Inject(HTTP_ADAPTER_HOST)
  protected readonly httpAdapterHost: HttpAdapterHost;

  protected renderContext: any

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const http = context.switchToHttp()
    const req: Request = http.getRequest()
    const res = http.getResponse()
    const ssrRenderMeta = this.reflector.get(SSR_RENDER_METADATA, context.getHandler());
    let result: any
    const key = req.url
    result = await this.cache.get(key)
    if (!result) {
      result = await firstValueFrom(next.handle())
      if (ssrRenderMeta) {
        const options = { stream: true, ...ssrRenderMeta }
        if (result instanceof RedirectException) {
          res.redirect(result.getRedirectUrl())
          return
        } else {
          this.renderContext = {
            request: req,
            response: res,
            ...result
          }
          try {
            result = await this.getRenderContent(options)
            if (result instanceof Stream) {
              return of(await this.sendStream(res, result))
            } else {
              this.cache.set(key, result, 3600)
            }
          } catch (error) {
            throw new InternalServerErrorException(error.message);
          }
        }
      }
    }
    return of(result)
  }

  getRenderContent(options: any) {
    try {
      return render<Readable>(this.renderContext, options)
    } catch (error) {
      return this.renderCsr()
    }
  }

  sendStream(res: Response, stream) {
    return new Promise<void>((resolve, reject) => {
      stream.pipe(res, { end: false })
      stream.on('end', () => {
        res.end();
        resolve()
      })
      stream.on('error', (err) => {
        reject(err)
      })
    })
  }

  renderCsr() {
    try {
      return render<Readable>(this.renderContext, { mode: 'csr' })
    } catch (error) {
      throw error;
    }
  }
}
