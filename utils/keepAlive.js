// Keep backend alive by pinging health endpoint
const BACKEND_URL = 'https://snacks-back01-production.up.railway.app'
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

// Aggressive warmup with multiple attempts and long timeout
export const warmUpBackend = async (onProgress) => {
  if (typeof window === 'undefined') return false

  const startTime = Date.now()
  let attemptCount = 0
  const maxAttempts = 3

  while (attemptCount < maxAttempts) {
    attemptCount++
    
    try {
      if (onProgress) {
        onProgress(`Attempt ${attemptCount}/${maxAttempts}...`)
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout per attempt

      const response = await fetch(`${BACKEND_URL}/api/products?limit=1`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      clearTimeout(timeoutId)
      
      if (response.ok) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        console.log(`[WarmUp] Backend ready in ${elapsed}s (${attemptCount} attempts)`)
        if (onProgress) {
          onProgress(`Connected in ${elapsed}s!`)
        }
        return true
      }
    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      console.log(`[WarmUp] Attempt ${attemptCount} failed after ${elapsed}s:`, error.message)
      
      if (attemptCount < maxAttempts) {
        // Wait 2 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`[WarmUp] Backend still cold after ${elapsed}s`)
  if (onProgress) {
    onProgress(`Still warming up after ${elapsed}s...`)
  }
  return false
}

// Quick check if backend is responsive (fast timeout)
export const checkBackendStatus = async () => {
  if (typeof window === 'undefined') return false

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second quick check

    const response = await fetch(`${BACKEND_URL}/api/products?limit=1`, {
      method: 'HEAD',
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    return false
  }
}

