import { Controller, Get, Inject, Req } from '@nestjs/common'
import { ApiService } from './index.service'
// import { LoggerService } from 'src/core/logger'
import { SsrRender } from '@/core/render'
import { Request } from 'express'
import { RedirectException } from '@/core/exceptions/redirect.exception'

@Controller('/')
export class AppController {
  @Inject(ApiService) private readonly apiService: ApiService

  @Get('/')
  @SsrRender({ stream: false })
  async handlerIndex(@Req() req: Request): Promise<any> {
    if (req.query.fc) {
      throw new RedirectException('/fff', 302)
    }
    // if (req.res) {
    //   req.res.redirect(302, '/fff')
    //   return 
    // }
    return { apiService: this.apiService }
    // return await this.render.render({ req, res }, this.apiService)
  }
}
