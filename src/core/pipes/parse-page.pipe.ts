import { ErrorCode } from "~/constants/error"
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"
import { MyHttpException } from "../exceptions/my-http.exception"

@Injectable()
export class ParsePagePipe implements PipeTransform<string, number> {
  constructor() {
    //
  }

  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== "query") {
      return value
    }
    let page: number = parseInt(value, 10)
    if (isNaN(page)) {
      page = 1
    }
    return page
  }
}

@Injectable()
export class ParseArticleIdPipe implements PipeTransform<string, number> {
  constructor() {
    //
  }

  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== "param" && metadata.type !== "query") {
      return value
    }
    const id: number = parseInt(value, 36)
    if (isNaN(id)) {
      throw new MyHttpException({
        code: ErrorCode.NotFound.CODE,
      })
    }
    return id
  }
}

@Injectable()
export class ParsePageSizePipe implements PipeTransform<string, number> {
  constructor() {
    //
  }

  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== "query") {
      return value
    }
    let pageSize: number = parseInt(value, 10)
    if (isNaN(pageSize)) {
      pageSize = 20
    }
    return pageSize
  }
}
