export default async (ctx: any) => {
  return Promise.resolve({
    // 建议根据模块给数据加上 namespace防止数据覆盖
    config: {}
  })
}
