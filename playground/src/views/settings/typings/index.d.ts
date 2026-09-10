export type ProviderFormMode = 'create' | 'edit';

export interface ProviderFormModel {
  id?: number
  provider_name: string
  base_url: string
  apiKey: string
}

export type ModelFormMode = 'create' | 'edit';

export interface ModelFormModel {
  id?: number
  provider_id: number
  model_name: string
}
