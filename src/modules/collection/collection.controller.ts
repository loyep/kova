import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { APIPrefix } from "@/constants/constants"
import { ParsePagePipe } from "@/core/pipes/parse-page.pipe"
import { MustIntPipe } from "@/core/pipes/must-int.pipe"
import { CurUser } from "@/core/decorators/user.decorator"
import { CollectionService } from "./collection.service"
import { JwtAuthGuard } from "@/core/guards/auth.guard"

@Controller()
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
  ) {}

  @ApiOperation({ summary: "文章点赞", tags: ["article"] })
  @Post(`${APIPrefix}articles/:articleId/collection`)
  @UseGuards(JwtAuthGuard)
  async collection(@CurUser() user, @Param("articleId", MustIntPipe) articleId: number) {
    await this.collectionService.collection(articleId, user.id)
    return {}
  }

  @ApiOperation({ summary: "取消文章点赞", tags: ["article"] })
  @Delete(`${APIPrefix}articles/:articleId/collection`)
  @UseGuards(JwtAuthGuard)
  async cancelCollection(@CurUser() user, @Param("articleId", MustIntPipe) articleId: number) {
    await this.collectionService.cancelCollection(articleId, user.id)
    return {}
  }

  @ApiOperation({ summary: "查看某用户点赞的文章", tags: ["article"] })
  @Get(`${APIPrefix}articles/users/:userId/collection`)
  async userCollectionArticles(
    @Param("userId", MustIntPipe) userId: number,
    @Query("page", ParsePagePipe) page: number,
  ) {
    return await this.collectionService.userCollectionArticles(userId, { page })
  }
}
