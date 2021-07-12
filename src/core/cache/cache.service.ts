import { Injectable } from "@nestjs/common"
import { RedisService } from "~/core/cache"
import type { Redis } from "ioredis"
import { LoggerService } from "../logger/logger.service"
import { isFunction, isEmpty } from 'lodash'

type DefCallback<T> = null | undefined | T | (() => Promise<T> | T)

@Injectable()
export class CacheService {
  static readonly foreverTtl = 0
  private ttl = 600
  public store: Redis

  constructor(private readonly redisService: RedisService, private readonly logger: LoggerService) {
    this.store = this.redisService.getClient()
  }

  private _value<T>(callback: DefCallback<T>): Promise<T | null>
  private async _value<T>(callback: unknown) {
    return isFunction(callback) ? await callback() : callback
  }

  async get<T = any>(key: string, def: DefCallback<T> = null): Promise<T | null> {
    const cached = await this.store.get(key)
    if (cached) {
      try {
        const value: T = JSON.parse(cached)
        return value
      } catch (error) {
        this.logger.log({ data: { error } })
      }
      return null
    }

    if (def) {
      return await this._value(def)
    }
    return null
  }

  async pull<T = any>(key: string, def: DefCallback<T> = null): Promise<T | null> {
    const cached: T | null = await this.get(key)
    if (cached) {
      await this.forget(key)
    }
    if (def) {
      return await this._value(def)
    }
    return cached
  }

  forget(key: string): Promise<boolean> {
    return new Promise((resolve) =>
      this.store.del(key, (err) => {
        resolve(!err)
      }),
    )
  }

  async put<T>(key: string, value: T, ttl = this.ttl): Promise<boolean> {
    let res: "OK" | null
    if (ttl === 0) {
      res = await this.store.set(key, JSON.stringify(value))
    } else {
      res = await this.store.set(key, JSON.stringify(value), "EX", ttl)
    }
    return res !== null
  }

  async has<T>(key: string): Promise<boolean> {
    return !isEmpty(await this.get(key))
  }

  async missing<T>(key: string): Promise<boolean> {
    return !(await this.has<T>(key))
  }

  async add<T>(key: string, value: T, ttl = this.ttl): Promise<T | boolean> {
    const exists = await this.has(key)
    if (!exists) {
      return await this.put(key, value, ttl)
    }
    return false
  }

  async remember<T>(key: string, callback: DefCallback<T>, ttl = this.ttl) {
    let value: T | null = await this.get(key)
    if (!value || isEmpty(value)) {
      value = await this._value(callback)
      await this.put(key, value, ttl)
    }
    return value
  }

  forever<T>(key: string, value: T) {
    return this.put(key, value, CacheService.foreverTtl)
  }

  /**
   * Get an item from the cache, or execute the given Closure and store the result forever.
   *
   * @param key
   * @param callback
   */
  sear<T>(key: string, callback: DefCallback<T>) {
    return this.rememberForever(key, callback)
  }

  set<T>(key: string, value: T, ttl = this.ttl) {
    return this.put(key, value, ttl)
  }

  rememberForever<T>(key: string, callback: DefCallback<T>) {
    return this.remember(key, callback, CacheService.foreverTtl)
  }
}
