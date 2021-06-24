import { DynamicModule, Global, Module } from "@nestjs/common"
import { CacheService } from "./cache.service"
import { RedisModule } from "nestjs-redis"
import { ConfigService } from "@nestjs/config"

const imports = [
  RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      const cache = configService.get('redis.cache')
      return {
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
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {

  static forRoot(): DynamicModule {
    return {
      module: CacheModule,
      imports: [
        RedisModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const cache = configService.get('redis.cache')
            return {
              host: cache.host,
              port: cache.port,
              password: cache.password,
              db: cache.database,
            }
          },
          inject: [ConfigService],
        }),
      ],
      providers: [CacheService],
      exports: [CacheService],
    }
  }

}
