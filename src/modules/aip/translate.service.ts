import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { createHash } from "crypto"
import { firstValueFrom } from "rxjs"

const encrypt = (algorithm: string, content: string) => {
  const hash = createHash(algorithm)
  hash.update(content)
  return hash.digest("hex")
}
const md5 = (content: string) => encrypt("md5", content)

@Injectable()
export class TranslateService {
  private readonly baseUrl = "https://fanyi-api.baidu.com/api/trans/vip/translate"

  constructor(
    private readonly http: HttpService,
  ) {
  }

  async translate(q: string) {
    if (!q) {
      return ""
    }
    const salt = new Date().getTime()
    const appid = ""
    const secret = ""
    const sign = md5(`${appid}${q}${salt}${secret}`)
    const url = this.baseUrl
    const { data } = await firstValueFrom(this.http
      .get(url, { params: { appid, salt, q, from: "auto", to: "en", sign } }))
    const {
      trans_result: [{ dst }],
    } = data
    return dst
  }
}
