import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FollowService } from "./follow.service"

// Controllers
import { UserController } from "./user.controller"
import { ApiController } from "./api.controller"

// Services
import { UserService } from "./user.service"
import { User } from "@/entity/user.entity"

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService, FollowService],
    controllers: [UserController, ApiController],
    exports: [UserService],
})
export class UserModule { }
