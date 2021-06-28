import { CacheService } from "~/core/cache"
import { HttpService, Inject, Injectable } from "@nestjs/common"
import { firstValueFrom } from "rxjs"

@Injectable()
export class SolutionService {
  private readonly baseUrl = "https://aip.baidubce.com"

  @Inject(CacheService) private readonly cache: CacheService

  constructor(
    private readonly http: HttpService,
  ) { 
  }

  async getAccessToken() {
    const aipCacheKey = "aip_solution_access_token"
    let accessToken = await this.cache.get(aipCacheKey)
    if (!accessToken) {
      const clientId = ""
      const clientSecret = ""
      const url = `${this.baseUrl}/oauth/2.0/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
      const { data } = await firstValueFrom(this.http.post(url))
      accessToken = data.access_token
      const expiresIn = (Number(data.expires_in) || 2592000) - 60000
      await this.cache.set(aipCacheKey, accessToken, expiresIn)
    }
    return accessToken
  }

  async textCensorUserDefined(text: string) {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/rest/2.0/solution/v1/text_censor/v2/user_defined?access_token=${accessToken}&text=${encodeURIComponent(
      text,
    )}`
    text = text.substr(0, 6000)
    const { data } = await firstValueFrom(this.http.post(url,
      { text: encodeURIComponent(text) },
      { headers: { "content-type": "application/x-www-form-urlencoded" } },
    ))
    const { data: conclusionData } = data
    if (Array.isArray(conclusionData)) {
      let msg = ""
      conclusionData.forEach((conclusion) => {
        msg += conclusion.msg
      })
      return msg
    }
    return ""
  }
}
