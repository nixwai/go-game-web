declare namespace Api {
  namespace Ai {
    /** AI 模型信息。 */
    interface ModelResponse {
      id: number
      model_name: string
      status: 'active' | 'disabled'
      is_default: boolean
      created_at?: string
    }

    /** AI 产商信息。 */
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

    /** 新增 AI 产商的请求参数。 */
    interface CreateProviderPayload {
      provider_name: string
      base_url: string
      encrypted_api_key: string
    }

    /** 更新 AI 产商的请求参数。 */
    interface UpdateProviderPayload {
      id: number
      provider_name?: string
      base_url?: string
      encrypted_api_key?: string
      status?: 'active' | 'disabled'
    }

    /** 删除 AI 产商的请求参数。 */
    interface DeleteProviderPayload {
      id: number
    }

    /** 新增 AI 模型的请求参数。 */
    interface CreateModelPayload {
      provider_id: number
      model_name: string
    }

    /** 更新 AI 模型的请求参数。 */
    interface UpdateModelPayload {
      id: number
      model_name?: string
      status?: 'active' | 'disabled'
    }

    /** 删除 AI 模型的请求参数。 */
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
