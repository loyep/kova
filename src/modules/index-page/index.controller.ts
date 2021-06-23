import { Controller, Get, Inject } from '@nestjs/common'
import { ApiService } from './index.service'
// import { LoggerService } from 'src/core/logger'
import { SsrRender } from 'src/core/render'

@Controller('/')
export class AppController {
  //
  // @Inject(LoggerService) private readonly logger: LoggerService
  //
  @Inject(ApiService) private readonly apiService: ApiService

  // @Get('/')
  // async handlerIndex(@Req() req: Request, @Res() res: Response): Promise<any> {
  //   console.log(this.logger)
  //   try {
  //     const ctx = {
  //       request: req,
  //       response: res,
  //       apiService: this.apiService
  //     }
  //     const stream = await render<Readable>(ctx, {
  //       stream: true
  //     })
  //     stream.pipe(res, { end: false })
  //     stream.on('end', () => {
  //       res.end()
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     res.status(500).send(error)
  //   }
  // }

  @Get('/')
  @SsrRender({ stream: false })
  async handlerIndex(): Promise<any> {
    // if (req.res) {
    console.log('ttt')
    //   req.res.redirect(302, '/fff')
    //   return 
    // }
    return { apiService: this.apiService }
    // return await this.render.render({ req, res }, this.apiService)
  }
}
