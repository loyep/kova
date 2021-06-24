import { APIPrefix } from '@/constants'
import { ParsePagePipe } from '@/core/pipes/parse-page.pipe'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation } from "@nestjs/swagger"
import { ArticleService } from './article.service'

@Controller('/api')
export class ApiController {
  constructor (private readonly service: ArticleService) {}

  @ApiOperation({ summary: "用户列表", tags: ["article"] })
  @Get(`${APIPrefix}articles`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.service.paginate(page, { s })
  }
}
