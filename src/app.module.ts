import { Module } from '@nestjs/common'
import { CacheModule } from './core/cache'
import { ConfigModule } from './core/config'
import { LoggerModule } from './core/logger'
import { DetailModule } from './modules/detail-page/detail.module'
import { indexModule } from './modules/index-page/index.module'

@Module({
  imports: [ConfigModule, CacheModule, LoggerModule, DetailModule, indexModule,]
})
export class AppModule {}
