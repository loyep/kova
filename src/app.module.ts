import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { CacheModule, ConfigModule, LoggerModule } from './core'
import { LoggerMiddleware } from './middleware/logger.middleware'
import { DetailModule } from './modules/detail-page/detail.module'
import { indexModule } from './modules/index-page/index.module'

@Module({
  imports: [ConfigModule, CacheModule, LoggerModule, DetailModule, indexModule,]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const middlewares = [
      LoggerMiddleware,
    ]
    consumer.apply(...middlewares).forRoutes({ path: "*", method: RequestMethod.ALL })
  }

}
