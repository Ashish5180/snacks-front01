// API utility functions
const getApiUrl = () => {
  // Use environment variable if available, otherwise fallback to hardcoded URL
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return 'https://snacks-back01.onrender.com/api'
}

const buildApiUrl = (endpoint) => {
  const baseUrl = getApiUrl()
  // Remove trailing slash from baseUrl and leading slash from endpoint
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanEndpoint = endpoint.replace(/^\//, '')
  return `${cleanBaseUrl}/${cleanEndpoint}`
}

export { getApiUrl, buildApiUrl }
