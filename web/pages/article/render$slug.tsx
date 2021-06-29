import React, { useContext, useEffect, useState } from 'react'
import type { FC } from 'react'
import { SProps, IContext } from 'ssr-types-react'
import type { Ddata } from '@/interface'
import { useHistory, useParams } from 'react-router'
import { Button } from 'antd'

const article:FC<SProps> = (props: SProps) => {
  const { state, dispatch } = useContext<IContext<Ddata>>(window.STORE_CONTEXT)
  const params = useParams()
  const [route, setRoute] = useState({})
  const history = useHistory()

  useEffect(() => {
    console.log(state)
    setRoute(params)
  }, [])

  useEffect(() => {
    console.log(state)
  }, [state])

  const onBack = () => {
    history.push('/')
  }
  
  return (
    <div>
      {JSON.stringify(route)}
      <Button onClick={onBack}>首页</Button>
      文章详情
    </div>
  )
}

export default article