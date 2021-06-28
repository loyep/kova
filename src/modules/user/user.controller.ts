import { AdminAPIPrefix, APIPrefix } from "~/constants/constants"
import { ErrorCode } from "~/constants/error"
import { MyHttpException } from "~/core/exceptions/my-http.exception"
import { ParsePagePipe, ParsePageSizePipe } from "~/core/pipes/parse-page.pipe"
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { UserService } from "./user.service"
import { FollowService } from "./follow.service"
import { UpdateUserDto } from "./dto/update-user.dto"

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
  ) {}


  @ApiOperation({ summary: "用户列表", tags: ["user"] })
  @Get(`${APIPrefix}users`)
  async list(@Query("s") s: string, @Query("page", ParsePagePipe) page: number) {
    return await this.userService.paginate(page, { s })
  }

  @Get(`${APIPrefix}users/:login`)
  async getByName(@Param("login") login: string) {
    try {
      const user = await this.userService.findByName(login)
      const followers = await this.followService.followings(user.id).getMany()
      const followings = await this.followService.followings(user.id).getMany()
      return { followings, followers, ...user }
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @ApiOperation({ summary: "管理后台用户列表", tags: ["user"] })
  @Get(`${AdminAPIPrefix}users`)
  findAll(
    @Query("s") s: string,
    @Query("page", ParsePagePipe) page: number,
    @Query("pageSize", ParsePageSizePipe) pageSize: number,
  ) {
    return this.userService.index(page, pageSize, { s }, [
      "id",
      "image",
      "name",
      "login",
      "email",
      "avatar",
      "status",
      "created_at",
    ])
  }

  @Get(`${AdminAPIPrefix}users/:id`)
  async showUser(@Param("id") id: number | string) {
    try {
      const user = await this.userService.findById(id)
      console.log(user)
      return user
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
        message: ErrorCode.NotFound.MESSAGE,
      })
    }
  }

  @Put(`${AdminAPIPrefix}users/:id`)
  async update(@Param("id") id: number, @Body() user: UpdateUserDto) {
    try {
      return await this.userService.update(id, user)
    } catch (error) {
      throw new MyHttpException({
        code: ErrorCode.SlugExists.CODE,
        message: error.message,
      })
    }
  }
}
