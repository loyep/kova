import {
  DynamicModule,
  Global,
  Module,
  Inject,
  OnModuleDestroy,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CacheModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import {
  createAsyncClientOptions,
  createClient,
  RedisClient,
} from './redis-client.provider';
import { ConfigModule } from '@nestjs/config'
import { REDIS_MODULE_OPTIONS, REDIS_CLIENT } from './cache.constants';
import { RedisService } from './redis.service';
import { Config2Service } from '../config.service';

@Global()
@Module({
  providers: [RedisService, Config2Service],
  exports: [RedisService],
  imports: [ConfigModule, Config2Service],
})
export class RedisCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions | RedisModuleOptions[],
    private readonly moduleRef: ModuleRef,
  ) {}

  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    return {
      module: RedisCoreModule,
      providers: [
        createClient(),
        { provide: REDIS_MODULE_OPTIONS, useValue: options },
      ],
      exports: [RedisService],
    };
  }

  static forRootAsync(options: CacheModuleAsyncOptions): DynamicModule {
    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [RedisService],
    };
  }

  onModuleDestroy() {
    const closeConnection = ({ clients, defaultKey }) => options => {
      const name = options.name || defaultKey;
      const client = clients.get(name);

      if (client && !options.keepAlive) {
        client.disconnect();
      }
    };

    const redisClient = this.moduleRef.get<RedisClient>(REDIS_CLIENT);
    const closeClientConnection = closeConnection(redisClient);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClientConnection);
    } else {
      closeClientConnection(this.options);
    }
  }
}
