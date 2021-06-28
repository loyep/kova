import { useEnhancedEffect } from "@/hooks"
import { FC, Fragment, ReactNode, useEffect, useState } from "react"

export interface NoSsrProps {
  children: ReactNode
  defer?: boolean
  fallback?: ReactNode
  onMouted?: (monted: boolean) => void
}

export const NoSsr: FC<NoSsrProps> = (props) => {
  const { children, defer = false, fallback = null, onMouted } = props
  const [mountedState, setMountedState] = useState(false)

  useEnhancedEffect(() => {
    if (!defer) {
      setMountedState(true)
    }
  }, [defer])

  useEffect(() => {
    if (defer) {
      setMountedState(true)
    }
  }, [defer])

  useEffect(() => {
    if (onMouted) {
      onMouted(mountedState)
    }
  }, [mountedState])

  return <Fragment>{mountedState ? children : fallback}</Fragment>
}

export default NoSsr
