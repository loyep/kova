import { CallHandler, ExecutionContext, Inject, Injectable, InternalServerErrorException, NestInterceptor, Optional } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from 'express-serve-static-core';
import { Observable, of, firstValueFrom } from "rxjs";
import { RedirectException } from "../exceptions/redirect.exception";
import { render } from "ssr-core-react";
import { Readable, Stream } from 'stream';
import { SSR_RENDER_METADATA } from "./ssr-render.constants";
import { CacheService } from "../cache";

const REFLECTOR = 'Reflector';

export interface SsrRenderOptions {
  stream?: boolean;
  cache?: boolean;
}

@Injectable()
export class SsrRenderInterceptor implements NestInterceptor {

  @Inject(REFLECTOR) protected readonly reflector: Reflector

  @Optional()
  @Inject(CacheService) private cache: CacheService

  protected renderContext: any

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const http = context.switchToHttp()
    const req: Request = http.getRequest()
    const res: Response = http.getResponse()
    const ssrRenderMeta = this.reflector.get(SSR_RENDER_METADATA, context.getHandler());
    const { cache = false, ...options } = { cache: false, stream: false, ...ssrRenderMeta }
    let result: any
    const key = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const noCache = req.get('cache-control') === 'no-cache'
    console.log('cache', cache)
    if (cache && !noCache) {
      result = await this.cache.get(key)
    }

    if (result) {
      return of(result)
    }
    try {
      result = await firstValueFrom(next.handle())
      this.renderContext = {
        request: req,
        response: {},
        ...result
      }
      res.contentType('text/html')
      const content = await this.getRenderContent(options)
      if (content instanceof Stream) {
        // return of(await this.sendStream(res, content))
        await this.sendStream(res, content)
        return
      }
      if (cache) this.cache.set(key, content, 300)
      // return of(content)
      // res.send(content)
      return of(content)
    } catch (error) {
      if (error instanceof RedirectException) {
        res.redirect(error.getRedirectUrl())
        return
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
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
