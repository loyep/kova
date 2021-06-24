// import { SsrRender } from '@/core/render'
import { Controller, Get, } from '@nestjs/common'
import { ArticleApiService } from './article-api.service'

@Controller()
export class ArticleController {
  constructor(private readonly service: ArticleApiService) { }

  @Get('/')
  // @SsrRender()
  async test() {
    const data = await this.service.getIndexData()
    return data
  }
}
