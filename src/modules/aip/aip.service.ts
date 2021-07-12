import { CacheService } from '~/core/cache'
import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AipService {
  private readonly baseUrl = 'https://aip.baidubce.com/rpc/2.0'

  @Inject(CacheService) private readonly cache: CacheService

  constructor (private readonly http: HttpService) {
    //
  }

  async getAccessToken () {
    const aipCacheKey = 'aip_access_token'
    let accessToken = await this.cache.get(aipCacheKey)
    if (!accessToken) {
      const clientId = ''
      const clientSecret = ''
      const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
      const { data } = await firstValueFrom(this.http.post(url))
      accessToken = data.access_token
      const expiresIn = (Number(data.expires_in) || 2592000) - 60000
      await this.cache.set(aipCacheKey, accessToken, expiresIn)
    }
    return accessToken
  }

  async keyword (title: string, content: string) {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/nlp/v1/keyword?access_token=${accessToken}&charset=UTF-8`
    const { data } = await firstValueFrom(this.http.post(url, { title, content }))
    return data
  }

  async topic (title: string, content: string) {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/nlp/v1/topic?access_token=${accessToken}&charset=UTF-8`
    const { data } = await firstValueFrom(this.http.post(url, { title, content }))
    return data
  }

  async newsSummary (content: string, maxSummaryLen = 200, options: { title?: string } = {}) {
    const accessToken = await this.getAccessToken()
    const url = `${this.baseUrl}/nlp/v1/news_summary?access_token=${accessToken}&charset=UTF-8`
    content = content.substr(0, 3000)
    const { data } = await firstValueFrom(this.http
      .post(url, { content, max_summary_len: maxSummaryLen, ...options }))
    return data
  }
}
