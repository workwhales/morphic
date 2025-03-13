import { Model } from '@/lib/types/models'
import defaultModels from './default-models.json'

// Only import headers in server environment
const isServer = typeof window === 'undefined'
let headers: () => Headers

if (isServer) {
  // Lazy load headers for server-side only
  headers = () => require('next/headers').headers()
}

export function validateModel(model: any): model is Model {
  return (
    typeof model.id === 'string' &&
    typeof model.name === 'string' &&
    typeof model.provider === 'string' &&
    typeof model.providerId === 'string' &&
    typeof model.enabled === 'boolean' &&
    (model.toolCallType === 'native' || model.toolCallType === 'manual') &&
    (model.toolCallModel === undefined ||
      typeof model.toolCallModel === 'string')
  )
}

export async function getModels(): Promise<Model[]> {
  try {
    // Check for BASE_URL environment variable first
    const baseUrlEnv =
      typeof process !== 'undefined' ? process.env.BASE_URL : undefined
    let baseUrlObj: URL

    if (baseUrlEnv) {
      try {
        baseUrlObj = new URL(baseUrlEnv)
        console.log('Using BASE_URL environment variable:', baseUrlEnv)
      } catch (error) {
        console.warn(
          'Invalid BASE_URL environment variable, falling back to headers'
        )
        baseUrlObj = await getBaseUrlFromHeaders()
      }
    } else {
      // If BASE_URL is not set, use headers
      baseUrlObj = await getBaseUrlFromHeaders()
    }

    // Construct the models.json URL
    const modelUrl = new URL('/config/models.json', baseUrlObj)

    try {
      const response = await fetch(modelUrl, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        console.warn(
          `HTTP error when fetching models: ${response.status} ${response.statusText}`
        )
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      // Check if the response starts with HTML doctype
      if (text.trim().toLowerCase().startsWith('<!doctype')) {
        console.warn('Received HTML instead of JSON when fetching models')
        throw new Error('Received HTML instead of JSON')
      }

      const config = JSON.parse(text)
      if (Array.isArray(config.models) && config.models.every(validateModel)) {
        return config.models
      }
    } catch (error: any) {
      // Fallback to default models if fetch fails
      console.warn(
        'Fetch failed, falling back to default models:',
        error.message || 'Unknown error'
      )
    }
  } catch (error) {
    console.warn('Failed to load models:', error)
  }

  // Fallback to default models
  if (
    Array.isArray(defaultModels.models) &&
    defaultModels.models.every(validateModel)
  ) {
    return defaultModels.models
  }

  // Last resort: return empty array
  console.warn('All attempts to load models failed, returning empty array')
  return []
}

// Helper function to get base URL from headers
async function getBaseUrlFromHeaders(): Promise<URL> {
  if (!isServer) {
    // In the client, create base URL from window.location
    return new URL(window.location.origin)
  }

  try {
    const headersList = await headers()
    const baseUrl = headersList.get('x-base-url')
    const url = headersList.get('x-url')
    const host = headersList.get('x-host')
    const protocol = headersList.get('x-protocol') || 'http:'

    // Try to use the pre-constructed base URL if available
    if (baseUrl) {
      return new URL(baseUrl)
    } else if (url) {
      return new URL(url)
    } else if (host) {
      const constructedUrl = `${protocol}${
        protocol.endsWith(':') ? '//' : '://'
      }${host}`
      return new URL(constructedUrl)
    }
  } catch (urlError) {
    console.warn('Error getting base URL from headers:', urlError)
  }

  // Fallback to default URL
  return new URL('http://localhost:3000')
}
