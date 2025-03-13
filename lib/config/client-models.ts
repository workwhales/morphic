import { Model } from '@/lib/types/models'
import defaultModels from './default-models.json'

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

export async function getClientModels(): Promise<Model[]> {
  try {
    // Get base URL from window location in client
    const baseUrlObj = new URL(window.location.origin)
    
    // Construct the models.json URL
    const modelUrl = new URL('/config/models.json', baseUrlObj)
    
    const response = await fetch(modelUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()

    // Check if the response starts with HTML doctype
    if (text.trim().toLowerCase().startsWith('<!doctype')) {
      throw new Error('Received HTML instead of JSON')
    }

    const config = JSON.parse(text)
    if (Array.isArray(config.models) && config.models.every(validateModel)) {
      return config.models
    }
  } catch (error) {
    console.warn('Failed to fetch models, falling back to defaults:', error)
  }

  // Fallback to default models
  if (
    Array.isArray(defaultModels.models) &&
    defaultModels.models.every(validateModel)
  ) {
    return defaultModels.models
  }

  // Last resort: return empty array
  return []
}