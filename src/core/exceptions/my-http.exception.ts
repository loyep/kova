import { HttpException, HttpStatus } from "@nestjs/common"
import { ErrorCode } from "@/constants/error"

export class MyHttpExceptionData {
  code?: number
  message?: string
}

export class MyHttpException extends HttpException {
  public readonly code: number
  public readonly message: string

  constructor(expData: MyHttpExceptionData) {
    if (expData && typeof expData.code === "undefined") {
      expData.code = ErrorCode.ParamsError.CODE
    }
    super(expData, HttpStatus.OK)
    this.code = expData.code
    this.message = expData.message
  }
}
