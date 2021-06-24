import { AdminAPIPrefix, APIPrefix } from "@/constants"
import { Controller, Get, Query, Param, Put, Body, Post, Delete } from "@nestjs/common"
import { TagService, TagNotFound } from "./tag.service"
import { ApiOperation } from "@nestjs/swagger"
import { ParsePagePipe, ParsePageSizePipe } from "@/core/pipes/parse-page.pipe"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ErrorCode } from "@/constants/error"
import { CreateTagDto } from "@/modules/tag/dto/create-tag.dto"
import { UpdateTagDto } from "@/modules/tag/dto/update-tag.dto"

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: "标签列表", tags: ["tag"] })
  @Get(`${APIPrefix}tags`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.tagService.paginate(page, { s })
  }

  @ApiOperation({ summary: "根据slug查标签", tags: ["tag"] })
  @Get(`${APIPrefix}tags/:slug`)
  async showBySlug(@Param("slug") slug: string) {
    try {
      const tag = await this.tagService.findBySlug(slug)
      if (!tag) {
        throw TagNotFound
      }
      return tag
    } catch (error) {
      throw TagNotFound
    }
  }

  @Get(`${AdminAPIPrefix}tags`)
  findAll(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.tagService.index(page, pageSize, { s }, [
      "id",
      "image",
      "name",
      "slug",
      "description",
      "created_at",
    ])
  }

  @Get(`${AdminAPIPrefix}tags/:id`)
  async findOne(@Param("id") id: number) {
    try {
      return await this.tagService.findById(id)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Put(`${AdminAPIPrefix}tags/:id`)
  async update(@Param("id") id: number | string, @Body() tag: UpdateTagDto) {
    try {
      return await this.tagService.update(id, tag)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.SlugExists.CODE,
        message: error.message,
      })
    }
  }

  @Post(`${AdminAPIPrefix}tags`)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto)
  }

  @Delete(`${AdminAPIPrefix}tags/:id`)
  remove(@Param("id") id: string) {
    return this.tagService.remove(+id)
  }
}
