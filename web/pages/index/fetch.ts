import { ISSRContext } from 'ssr-types-react'
import { IndexData } from '@/interface'
interface IApiService {
  getIndexData: () => Promise<IndexData>
}

export default async (ctx: ISSRContext<{
  service?: IApiService
}>) => {
  
  console.log(ctx.service)

  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx.service?.getIndexData()
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: data
  }
}
