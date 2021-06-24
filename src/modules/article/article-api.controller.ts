import { Controller, Post, Get, Query, Param, Body, Put, Delete,  Inject,  } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { ArticleService, ArticleNotFound } from "./article.service"
import { AdminAPIPrefix, APIPrefix } from "@/constants/constants"
import { ParsePagePipe, ParsePageSizePipe } from "@/core/pipes/parse-page.pipe"
import { MustIntPipe } from "@/core/pipes/must-int.pipe"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ErrorCode } from "@/constants/error"
import { CreateArticleDto } from "./dto/create-article.dto"
import { UpdateArticleDto } from "./dto/update-article.dto"
import { BaseResponse } from "@/core/common/response"
import { LoggerService } from "@/core/logger"

@Controller()
export class ArticleApiController {
  @Inject(LoggerService) private readonly logger: LoggerService

  constructor(
    private readonly service: ArticleService,
  ) {
  }

  @Get(`${APIPrefix}users/:id/articles`)
  async getArticleByUserId(
    @Param("id") userId: number,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePagePipe) pageSize: number,
  ) {
    return new BaseResponse({
      data: await this.service.paginate({ page, pageSize }, { userId })
    })
  }

  @Get(`${APIPrefix}banners`)
  async banner() {
    const res = await this.service.bannerList()
    this.logger.info(res)
    return res
  }

  @ApiOperation({ summary: "根据slug查文章", tags: ["article"] })
  @Get(`${APIPrefix}articles/:slug`)
  async getBySlug(@Param("slug") slug: string) {
    try {
      const article = await this.service.findBySlug(slug, { next: true, prev: true })
      return article
    } catch (error) {
      throw ArticleNotFound
    }
  }

  @ApiOperation({ summary: "查询文章列表" })
  @Get(`${APIPrefix}articles`)
  async list(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
    @Query("categoryId") categoryId: number,
    @Query("userId") userId: number,
    @Query("tagId") tagId: number,
  ) {
    return new BaseResponse(await this.service.paginate({ page, pageSize }, {
      userId,
      categoryId,
      s,
      tagId,
    }))
  }

  @ApiOperation({ summary: "创建文章" })
  @Post(`${APIPrefix}articles`)
  async create(@Body() article: CreateArticleDto) {
    const data = await this.service.create(article)
    return { data, message: "文章创建成功" }
  }

  @Get(`${AdminAPIPrefix}articles`)
  findAll(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.service.index(page, pageSize, { s })
  }

  @Get(`${AdminAPIPrefix}articles/:id`)
  async findOne(@Param("id", MustIntPipe) id: number | string) {
    try {
      return await this.service.findById(id)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @ApiOperation({ summary: "更新文章" })
  @Put(`${AdminAPIPrefix}articles/:id`)
  async update(@Param("id", MustIntPipe) id: number, @Body() newArticle: UpdateArticleDto) {
    try {
      return await this.service.update(id, newArticle)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Delete(`${APIPrefix}articles/:id`)
  remove(@Param("id", MustIntPipe) id: number) {
    return this.service.remove(id);
  }
}
