import { createParamDecorator } from "@nestjs/common"

export const CurUser = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest()
  return req.user
})
