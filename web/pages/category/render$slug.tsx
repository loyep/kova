import React, { useContext, useEffect } from 'react'
import { SProps, IContext } from 'ssr-types-react'
import { IData } from '@/interface'
import { Button } from 'antd'
import { useHistory } from 'react-router'

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
      分类页
      <Button onClick={onShowDetail}>test2</Button>
    </div>
  )
}
