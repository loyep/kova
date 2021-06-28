import { UnregisterCallback } from 'history'
import NProgress from "nprogress"
import React, { FC, useContext, useEffect, useState } from "react"
import { useHistory } from 'react-router-dom'
import { IContext } from "ssr-types-react"
import './index.less'

if (__isBrowser__) {
  NProgress.configure({ minimum: 0.1 })
}

export interface ProgressProps {
  color?: string
  timeout?: number
}

let unlisten: UnregisterCallback | undefined = undefined
let timer: NodeJS.Timeout

export const Progress: FC<ProgressProps> = (props) => {
  const { timeout = 200 } = props
  const { state } = useContext<IContext>(window.STORE_CONTEXT)
  const [loaded, setLoaded] = useState(false)
  const history = useHistory()

  const start = () => {
    clearTimeout(timer)
    timer = setTimeout(() => NProgress.start(), timeout)
  }

  const done = () => {
    clearTimeout(timer)
    NProgress.done()
  }

  useEffect(() => {
    if (loaded) done()
  }, [state])

  __isBrowser__ && unlisten && unlisten()
  unlisten = history.listen(() => {
    if (loaded) start()
  })

  useEffect(() => {
    if (__isBrowser__) {
      start()
      setLoaded(true)
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') done()
      };
    }
    return () => {
      unlisten && unlisten()
    }
  }, [])

  return <></>
}


export default Progress
