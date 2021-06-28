import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

// Controllers
import { CommentController } from "./comment.controller"

// Services
import { CommentService } from "./comment.service"

import { Comment } from "~/entity/comment.entity"
import { AipModule } from "~/modules/aip"

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), AipModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
