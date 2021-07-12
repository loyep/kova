import { DynamicModule, Module } from '@nestjs/common';
import { CacheModuleAsyncOptions } from './redis.interface';

import { RedisCoreModule } from './cache-core.module';
import { CacheService } from '../cache';
import { Config2Service } from '../config.service';

@Module({})
export class CacheModule {
  static forRoot(): DynamicModule {
    const cache = Config2Service.get('redis.cache')
    return {
      module: CacheModule,
      global: true,
      providers: [CacheService],
      exports: [CacheService],
      imports: [
        RedisCoreModule.register({
          host: cache.host,
          port: cache.port,
          password: cache.password,
          db: cache.database,
        })],
    };
  }

  static forRootAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return {
      module: CacheModule,
      global: true,
      providers: [CacheService],
      exports: [CacheService],
      imports: [RedisCoreModule.forRootAsync(options)],
    };
  }
}
