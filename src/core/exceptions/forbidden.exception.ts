/**
 * HttpForbidden error.
 * @file 403 错误生成器
 * @module error/forbidden
 * @author Surmon <https://github.com/surmon-china>
 */

import { ErrorCode } from "~/constants/error";
import { MyHttpException, MyHttpExceptionData } from "./my-http.exception";

/**
 * @class HttpForbiddenError
 * @classdesc 403 -> 无权限/权限不足
 * @example new HttpForbiddenError('错误信息')
 * @example new HttpForbiddenError(new Error())
 */
export class ForbiddenException extends MyHttpException {
  constructor(expData: MyHttpExceptionData) {
    super({
      ...expData,
      code: ErrorCode.Forbidden.CODE,
      message: ErrorCode.Forbidden.MESSAGE,
    })
  }
}
