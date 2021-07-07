import React, { useContext, useEffect } from 'react'
import { SProps, IContext } from 'ssr-types-react'
import { IData } from '@/interface'
import { Button, Card } from 'antd'
import { useHistory, NavLink } from 'react-router-dom'

export default (props: SProps) => {
  const { state, dispatch } = useContext<IContext<IData>>(window.STORE_CONTEXT)
  const history = useHistory()
  const onShowDetail = () => {
    history.push('/article/test')
  }

  useEffect(() => {
    console.log(state)
  }, [])

  return (
    <div>
      <NavLink to="/article/test233">
        <Button>测试详情页</Button>
      </NavLink>
      {((state?.indexData.data as any).items as any[]).map(item => (
        <Card title={item.title} style={{ width: '100%' }}>
        </Card>))}
    </div>
  )
}
