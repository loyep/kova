import { Topic } from "~/entity/topic.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

// Controllers
import { TopicController } from "./topic.controller"

// Services
import { TopicService } from "./topic.service"

// Repositories

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic])
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
