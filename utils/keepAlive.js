// Keep backend alive by pinging health endpoint
const BACKEND_URL = 'https://snacks-back01.onrender.com'
const PING_INTERVAL = 5 * 60 * 1000 // 5 minutes

let pingTimer = null

export const startBackendKeepAlive = () => {
  if (typeof window === 'undefined') return

  // Initial ping
  pingBackend()

  // Set up interval pinging
  if (pingTimer) {
    clearInterval(pingTimer)
  }

  pingTimer = setInterval(() => {
    pingBackend()
  }, PING_INTERVAL)
}

export const stopBackendKeepAlive = () => {
  if (pingTimer) {
    clearInterval(pingTimer)
    pingTimer = null
  }
}

const pingBackend = async () => {
  try {
    // Just a simple HEAD request to wake up the backend
    await fetch(`${BACKEND_URL}/api/products?limit=1`, {
      method: 'HEAD',
      mode: 'no-cors'
    })
    console.log('[KeepAlive] Backend pinged successfully')
  } catch (error) {
    // Silently fail - it's just a keep-alive
    console.log('[KeepAlive] Ping failed, backend might be cold')
  }
}

// Warm up backend immediately (for critical pages)
export const warmUpBackend = async () => {
  if (typeof window === 'undefined') return

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    await fetch(`${BACKEND_URL}/api/products?limit=1`, {
      method: 'GET',
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    console.log('[WarmUp] Backend is warm and ready')
    return true
  } catch (error) {
    console.log('[WarmUp] Backend warming up in background')
    return false
  }
}

