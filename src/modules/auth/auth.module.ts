import { Module } from '@nestjs/common'

// Controllers
import { AuthController } from './auth.controller'

// Services
import { AuthService } from './auth.service'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {
}
