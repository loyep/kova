import { Global, Module, CacheModule as NestCacheModule } from "@nestjs/common"
import { CacheService } from "./cache.service"
import { RedisService } from "@kova/nestjs-redis"
import { ConfigService } from "@nestjs/config"
import * as redisStore from 'cache-manager-redis-store';

const imports = [
  NestCacheModule.registerAsync({
    useFactory: (configService: ConfigService) => {
      const cache = configService.get('redis.cache')
      return {
        store: redisStore,
        host: cache.host,
        port: cache.port,
        password: cache.password,
        db: cache.database,
      }
    },
    inject: [ConfigService],
  }),
]

@Global()
@Module({
  imports,
  providers: [CacheService, RedisService],
  exports: [CacheService, RedisService],
})
export class CacheModule {}
