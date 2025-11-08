'use client'

import { useEffect } from 'react'
import { startBackendKeepAlive, stopBackendKeepAlive } from '../utils/keepAlive'

const BackendKeepAlive = () => {
  useEffect(() => {
    // Start pinging backend to keep it warm
    startBackendKeepAlive()

    // Cleanup on unmount
    return () => {
      stopBackendKeepAlive()
    }
  }, [])

  // This component doesn't render anything
  return null
}

export default BackendKeepAlive

