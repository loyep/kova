import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common"
import { TopicNotFound, TopicService } from "./topic.service"
import { AdminAPIPrefix, APIPrefix } from "@/constants/constants"
import { ApiOperation } from "@nestjs/swagger"
import { ParsePagePipe, ParsePageSizePipe } from "@/core/pipes/parse-page.pipe"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ErrorCode } from "@/constants/error"
import { Topic } from "@/entity/topic.entity"

@Controller()
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
  ) {}

  @ApiOperation({ summary: "分类列表", tags: ["topic"] })
  @Get(`${APIPrefix}topics`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.topicService.paginate(page, { s })
  }

  @ApiOperation({ summary: "根据slug查询分类", tags: ["topic"] })
  @Get(`${APIPrefix}topics/:slug`)
  async showBySlug(@Param("slug") slug: string) {
    try {
      return await this.topicService.findBySlug(slug)
    } catch (error) {
      throw TopicNotFound
    }
  }

  @ApiOperation({ summary: "查询分类", tags: ["topic"] })
  @Get(`${AdminAPIPrefix}topics/:id`)
  async findOne(@Param("id") id: number) {
    try {
      const topic = await this.topicService.findById(id)
      return topic
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Get(`${AdminAPIPrefix}topics`)
  index(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.topicService.index(page, pageSize, { s }, [
      "id",
      "image",
      "name",
      "description",
      "articles_count",
      "slug",
      "created_at",
    ])
  }

  @Put(`${AdminAPIPrefix}topics/:id`)
  async update(@Param("id") id: number | string, @Body() topic: Topic) {
    try {
      return await this.topicService.update(id, topic)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.SlugExists.CODE,
        message: error.message,
      })
    }
  }
}
