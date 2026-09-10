declare namespace Api {
  namespace Ai {
    interface ModelResponse {
      id: number
      model_name: string
      status: 'active' | 'disabled'
      is_default: boolean
      created_at?: string
    }

    interface ProviderResponse {
      id: number
      provider_name: string
      base_url: string
      status: 'active' | 'disabled'
      is_default: boolean
      has_api_key: boolean
      models: ModelResponse[]
      created_at?: string
    }

    interface CreateProviderPayload {
      provider_name: string
      base_url: string
      encrypted_api_key: string
    }

    interface UpdateProviderPayload {
      id: number
      provider_name?: string
      base_url?: string
      encrypted_api_key?: string
      status?: 'active' | 'disabled'
    }

    interface DeleteProviderPayload {
      id: number
    }

    interface CreateModelPayload {
      provider_id: number
      model_name: string
    }

    interface UpdateModelPayload {
      id: number
      model_name?: string
      status?: 'active' | 'disabled'
    }

    interface DeleteModelPayload {
      id: number
    }

    /** 扁平化的活跃模型选项。 */
    interface ModelOption {
      id: number
      model_name: string
      provider_id: number
      provider_name: string
      is_default: boolean
      has_api_key: boolean
    }
  }
}
