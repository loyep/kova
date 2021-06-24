import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common"
import { CacheModule, ConfigModule, LoggerModule } from "./core"
import { LoggerMiddleware } from "@/middleware/logger.middleware"
import { UserModule } from "./modules/user"
import { ArticleModule } from "./modules/article/article.module"
import { CategoryModule } from "./modules/category"
import { TagModule } from "./modules/tag"
import { TopicModule } from "./modules/topic"

@Module({
  imports: [ConfigModule, CacheModule, LoggerModule, UserModule, CategoryModule, TagModule, TopicModule, ArticleModule,]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const middlewares = [
      LoggerMiddleware,
    ]
    consumer.apply(...middlewares).forRoutes({ path: "*", method: RequestMethod.ALL })
  }

}
