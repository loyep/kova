import { Module } from '@nestjs/common'
import { CacheModule, ConfigModule, LoggerModule } from './core'
import { DetailModule } from './modules/detail-page/detail.module'
import { indexModule } from './modules/index-page/index.module'

@Module({
  imports: [ConfigModule, CacheModule, LoggerModule, DetailModule, indexModule,]
})
export class AppModule {}
