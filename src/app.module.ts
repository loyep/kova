import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule, LoggerModule } from './core'
import { CacheModule } from './core/cache'
import { LoggerMiddleware } from '~/middleware/logger.middleware'
import { UserModule } from './modules/user'
import { ArticleModule } from './modules/article/article.module'
import { CategoryModule } from '~/modules/category'
import { TagModule } from './modules/tag'
import { TopicModule } from './modules/topic'
import { DatabaseModule } from './core/database'
import { AuthModule } from '~/modules/auth'

@Module({
  imports: [ConfigModule, CacheModule.forRoot(), LoggerModule, DatabaseModule.forRoot(), AuthModule, UserModule, CategoryModule, TagModule, TopicModule, ArticleModule],
})
export class AppModule {
  configure (consumer: MiddlewareConsumer) {
    const middlewares = [
      LoggerMiddleware
    ]
    consumer.apply(...middlewares).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
