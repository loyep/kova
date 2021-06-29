import { ISSRContext } from 'ssr-types-react'
import { IndexData } from '@/interface'

type IApiService = {
  getHomeData: () => Promise<IndexData>
}

export default async (ctx: ISSRContext<{
  service?: IApiService
}>) => {
  const data = __isBrowser__ ? await (await window.fetch('/api/home')).json() : await ctx.service?.getHomeData()
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: data
  }
}
