import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common"
import { CategoryNotFound, CategoryService } from "./category.service"
import { AdminAPIPrefix, APIPrefix } from "~/constants/constants"
import { ApiOperation } from "@nestjs/swagger"
import { ParsePagePipe, ParsePageSizePipe } from "~/core/pipes/parse-page.pipe"
import { MyHttpException } from "~/core/exceptions/my-http.exception"
import { ErrorCode } from "~/constants/error"
import { CreateCategoryDto } from "~/modules/category/dto/create-category.dto"
import { UpdateCategoryDto } from "~/modules/category/dto/update-category.dto"

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: "分类列表", tags: ["category"] })
  @Get(`${APIPrefix}categories`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.categoryService.paginate(page, { s })
  }

  @ApiOperation({ summary: "根据slug查询分类", tags: ["category"] })
  @Get(`${APIPrefix}categories/:slug`)
  async showBySlug(@Param("slug") slug: string) {
    try {
      return await this.categoryService.findBySlug(slug)
    } catch (error) {
      throw CategoryNotFound
    }
  }

  @Put(`${AdminAPIPrefix}categories/:id`)
  async update(@Param("id", ParseIntPipe) id: number, @Body() category: UpdateCategoryDto) {
    try {
      return await this.categoryService.update(id, category)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.SlugExists.CODE,
        message: error.message,
      })
    }
  }

  @Post(`${AdminAPIPrefix}categories`)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get(`${AdminAPIPrefix}categories`)
  index(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.categoryService.index(page, pageSize, { s }, [
      "id",
      "image",
      "name",
      "description",
      "articles_count",
      "slug",
      "created_at",
    ])
  }

  @ApiOperation({ summary: "查询分类", tags: ["category"] })
  @Get(`${AdminAPIPrefix}categories/:id`)
  async show(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.categoryService.findOne(id)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Delete(`${AdminAPIPrefix}categories/:id`)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id)
  }
}
