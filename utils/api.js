// API utility functions
const getApiUrl = () => {
  // Use environment variable if available
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // In browser, use relative path to leverage Vercel rewrite proxy (avoids CORS)
  // This will be rewritten by vercel.json to the actual backend URL
  if (typeof window !== 'undefined') {
    return '/api'
  }
  
  // Server-side rendering fallback (for SSR/SSG)
  return 'https://snacks-back01-production.up.railway.app/api'
}

const buildApiUrl = (endpoint) => {
  const baseUrl = getApiUrl()
  // Remove trailing slash from baseUrl and leading slash from endpoint
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanEndpoint = endpoint.replace(/^\//, '')
  return `${cleanBaseUrl}/${cleanEndpoint}`
}

export { getApiUrl, buildApiUrl }
