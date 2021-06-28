import { SsrRender } from '~/core/render'
import { Controller, Get } from '@nestjs/common'
import { ArticleService } from './article.service'

@Controller()
export class ArticleController {
  constructor(private readonly service: ArticleService) { }

  @Get('/')
  @SsrRender({ cache: true })
  async home() {
    return {
      service: this.service
    }
  }

  @Get('/article/:slug')
  @SsrRender({ cache: true })
  async get() {
    return {
      // service: this.service
    }
  }

  @Get('/api/home')
  async getHomeData() {
    return this.service.getHomeData()
  }
}
