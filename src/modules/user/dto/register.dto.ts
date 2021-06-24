import { MinLength, IsString, Length } from "class-validator"
import { ErrorCode } from "@/constants/error"
import { UserConstants } from "@/constants/constants"

export enum LoginVerifyType {
  phone = "phone",
  email = "username",
}

export class RegisterDto {
  @MinLength(1, {
    message: "手机号码/邮箱地址或密码不正确",
  })
  @IsString()
  readonly username: string

  @Length(UserConstants.PASSWORD_MIN_LENGTH, UserConstants.PASSWORD_MAX_LENGTH, {
    message: ErrorCode.InvalidPassword.MESSAGE,
    context: {
      code: ErrorCode.InvalidPassword.CODE,
    },
  })
  @IsString({
    message: ErrorCode.InvalidPassword.MESSAGE,
    context: {
      code: ErrorCode.InvalidPassword.CODE,
    },
  })
  readonly password: string
}
