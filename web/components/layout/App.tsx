// 此文件将会在服务端/客户端都将会用到
// 可通过 __isBrowser__ 或者 useEffect 判断当前在 浏览器环境做一些初始化操作

import { LayoutProps } from 'ssr-types-react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react'
import { Progress } from '../UI/Progress'

export default (props: LayoutProps) => {

  return (
    <ConfigProvider locale={zhCN}>
      {/* <SettingContext.Provider value={settings}> */}
      {props.children}
      <Progress />
      {/* </SettingContext.Provider> */}
    </ConfigProvider>
  )
}
