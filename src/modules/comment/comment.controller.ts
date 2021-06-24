import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common"
import { CommentNotFound, CommentService } from "./comment.service"
import { AdminAPIPrefix, APIPrefix } from "@/constants/constants"
import { ApiOperation } from "@nestjs/swagger"
import { CacheService, LoggerService } from "@kova/core"
import { ParsePagePipe, ParsePageSizePipe } from "@/core/pipes/parse-page.pipe"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ErrorCode } from "@/constants/error"
import { CreateCommentDto } from "@/modules/comment/dto/create-comment.dto"
import { UpdateCommentDto } from "@/modules/comment/dto/update-comment.dto"
import { FastifyRequest } from "fastify"
import { SolutionService } from "@/modules/aip/solution.service"
import { SkipThrottle, Throttle } from "@nestjs/throttler";

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly logger: LoggerService,
    private readonly solution: SolutionService,
  ) {}

  @ApiOperation({ summary: "分类列表", tags: ["comment"] })
  @Get(`${APIPrefix}comments`)
  @Throttle(1, 60)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.commentService.paginate(page, { s })
  }

  // @ApiOperation({ summary: "根据slug查询分类", tags: ["comment"] })
  // @Get(`${APIPrefix}comments/:slug`)
  // async showBySlug(@Param("slug") slug: string) {
  //   try {
  //     const comment = await this.commentService.findBySlug(slug)
  //     if (!comment) {
  //       throw CommentNotFound
  //     }
  //     return comment
  //   } catch (error) {
  //     throw CommentNotFound
  //   }
  // }

  // @ApiOperation({ summary: "根据slug查询分类", tags: ["comment"] })
  @Post(`${APIPrefix}comments`)
  @Throttle(2, 60)
  async create(@Req() req, @Body() data: CreateCommentDto) {
    const conclusion = await this.solution.textCensorUserDefined(data.content)
    if (conclusion) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: conclusion,
      })
    }
    const comment = await this.commentService.create(data, { ip: this.getClientIp(req) })
    console.log(comment)
    return comment
  }

  getClientIp(req: FastifyRequest): string {
    return (req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress) as string
  }

  @ApiOperation({ summary: "查询分类", tags: ["comment"] })
  @Get(`${AdminAPIPrefix}comments/:id`)
  async findOne(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.commentService.findById(id)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Get(`${AdminAPIPrefix}comments`)
  findAll(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.commentService.index(page, pageSize, { s }, ["id", "created_at"])
  }

  @Put(`${AdminAPIPrefix}comments/:id`)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto)
  }

  @Delete(`${AdminAPIPrefix}comments/:id`)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.commentService.remove(id)
  }
}
