import { Module } from "@nestjs/common"

// Controllers
import { TopicController } from "@/content/topic.controller"

// Services
import { TopicService } from "@/content/topic.service"

// Repositories

@Module({
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
