import { CacheService } from "../cache.service"
import { CacheManagerOptions, InternalServerErrorException } from "@nestjs/common"
import "reflect-metadata"
import { tap, switchMap } from "rxjs/operators"
import { from, Observable, of } from "rxjs"

type Cacheable<T> = (...args: any[]) => Observable<T>

export function Cache<T>(options: CacheManagerOptions = {}) {
  return (target: any, methodName: string, descriptor: TypedPropertyDescriptor<Cacheable<T>>) => {
    const originalMethod = descriptor.value
    const className = target.constructor.name
    // const returnType = Reflect.getMetadata('design:returntype', target, methodName);
    // if (!returnType || returnType.name !== 'Observable') {
    //   throw new InternalServerErrorException('Target Method should return Observable');
    // }

    // @ts-ignore
    descriptor.value = function (...args: any[]) {
      const cache = (this as any).cacheService
      if (!cache || !(cache instanceof CacheService)) {
        // TODO: Can we do design time check if CacheService injected?
        throw new InternalServerErrorException("Target Class should inject CacheService")
      } else {
        const cacheKey = `${className}:${methodName}:${args.map((a) => JSON.stringify(a)).join()}`

        return from(cache.get<T>(cacheKey)).pipe(
          // @ts-ignore
          switchMap((res) => {
            if (res) return of(res)
            if (originalMethod) {
              return originalMethod
                .apply(this, args)
                .pipe(
                  tap((methodResult: T) => cache.put<T>(cacheKey, methodResult, options.ttl)),
                )
            }
            return null
          })
        )
      }
    }

    return descriptor
  }
}