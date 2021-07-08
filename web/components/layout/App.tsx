// 此文件将会在服务端/客户端都将会用到
// 可通过 __isBrowser__ 或者 useEffect 判断当前在 浏览器环境做一些初始化操作

import { LayoutProps } from 'ssr-types-react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import React, { useEffect, useRef, useState } from 'react'
import { Progress } from '../UI/Progress'
import { Layout, Menu } from 'antd';
import { useRouteMatch, useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const { Header, Footer, Content } = Layout;
const { SubMenu } = Menu;

export default (props: LayoutProps) => {
  const location = useLocation()

  useEffect(() => {
    console.log(location)
  }, [location])

  return (
    <ConfigProvider locale={zhCN}>
      <Layout>
        <Header style={{ top: 0, position: 'sticky', zIndex: 99 }}>
          <Menu selectedKeys={[location.pathname]} mode="horizontal" theme="dark">
            <Menu.Item key="/">首页</Menu.Item>
            <Menu.Item key="/article/testtt">
              <Link to="/article/testttt">
              文章
              </Link>
            </Menu.Item>
            <SubMenu key="SubMenu" title="Navigation Three - Submenu">
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Content>{props.children}</Content>
        <Footer>Footer</Footer>
      </Layout>
      <Progress />
    </ConfigProvider>
  )
}
