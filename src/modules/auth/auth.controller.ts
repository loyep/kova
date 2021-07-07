import { Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor (private readonly service: AuthService) {
  }

  @Get('/login')
  async showLoginPage () {

  }
}
