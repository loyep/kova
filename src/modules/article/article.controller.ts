import { SsrRender } from '@/core/render'
import { Controller, Get, } from '@nestjs/common'
import { ArticleService } from './article.service'

@Controller()
export class ArticleController {
  constructor(private readonly service: ArticleService) { }

  @Get('/')
  @SsrRender()
  test() {
    return { service: this.service }
  }
}
