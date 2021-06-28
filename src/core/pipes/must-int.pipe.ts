import { ArgumentMetadata, Injectable, PipeTransform, Scope } from "@nestjs/common"
import { ErrorCode } from "~/constants/error"
import { MyHttpException } from "../exceptions/my-http.exception"

@Injectable({ scope: Scope.REQUEST })
export class MustIntPipe implements PipeTransform<string, number> {
  constructor() { }

  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== "param" && metadata.type !== "query") {
      return value
    }
    const val = parseInt(value, 10)
    if (isNaN(val)) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
      })
    }
    // value 为 12.html 时，转成整数val为12，这时也应该返回404
    if (val + "" !== value) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
      })
    }
    return val
  }
}
