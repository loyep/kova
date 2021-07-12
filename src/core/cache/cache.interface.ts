import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Redis, RedisOptions } from 'ioredis';

export interface CacheModuleOptions extends RedisOptions {
  name?: string;
  url?: string;
  onClientReady?(client: Redis): void;
}

export interface CacheModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | CacheModuleOptions
    | CacheModuleOptions[]
    | Promise<CacheModuleOptions>
    | Promise<CacheModuleOptions[]>;
  inject?: any[];
}
