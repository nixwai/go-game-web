export type ProviderFormMode = 'create' | 'edit';

export interface ProviderFormModel {
  id?: number
  provider_name: string
  base_url: string
  apiKey: string
}

export interface ProviderDialogCreateOptions {
  mode?: 'create'
}

export interface ProviderDialogEditOptions {
  mode: 'edit'
  row: Api.Ai.ProviderResponse
}

export type ProviderDialogOpenOptions = ProviderDialogCreateOptions | ProviderDialogEditOptions;

export type ModelFormMode = 'create' | 'edit';

export interface ModelFormModel {
  id?: number
  provider_id: number
  model_name: string
}

export interface ModelDialogCreateOptions {
  mode: 'create'
  providerId: number
}

export interface ModelDialogEditOptions {
  mode: 'edit'
  providerId: number
  row: Api.Ai.ModelResponse
}

export type ModelDialogOpenOptions = ModelDialogCreateOptions | ModelDialogEditOptions;
