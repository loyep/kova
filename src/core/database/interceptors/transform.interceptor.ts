import { CallHandler, ExecutionContext, Injectable, NestInterceptor, PlainLiteralObject, Scope } from "@nestjs/common"
import { ClassTransformOptions } from "@nestjs/common/interfaces/external/class-transform-options.interface"
import { classToPlain } from "class-transformer"
import { isObject } from 'lodash'
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

type Res = PlainLiteralObject | Array<PlainLiteralObject>;

export interface Response {
  data: any
}

@Injectable({ scope: Scope.REQUEST })
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const call$ = next.handle()
    // return call$.pipe(
    //   map((result: any) => {
    //     result = classToPlain(this.transform(result), { exposeDefaultValues: true }) || {}
    //     const { data, message } = result
    //     return { code: 0, message: message || "成功", data: data || result }
    //   }),
    // )
    const options = {
    };

    return next.handle().pipe(
      map((res: Res) =>
        this.serialize(res, {
          ...options
        })
      )
    );
  }

  serialize(
    response: Res,
    options: ClassTransformOptions
  ): PlainLiteralObject | PlainLiteralObject[] {
    const isArray = Array.isArray(response)
    if (!isObject(response) && !isArray) {
      return response;
    }

    const data = (!isArray && 'data' in response) ? response.data : response
    const message = (!isArray && 'message' in response) ? response.message : ""

    return {
      code: 0, message: message || "成功",
      data: this.transformToPlain(data, options)
    }
  }

  transformToPlain(
    plainOrClass: unknown,
    options: ClassTransformOptions
  ): PlainLiteralObject {
    if (plainOrClass instanceof Model) {
      plainOrClass = plainOrClass.toJSON();
    } else if (Array.isArray(plainOrClass)) {
      return plainOrClass.map(obj => this.transformToPlain(obj, options))
    }
    return plainOrClass && plainOrClass.constructor !== Object
      ? classToPlain(plainOrClass, options)
      : plainOrClass;
  }
}
