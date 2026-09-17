/** AI 产商表单的编辑模式。 */
export type ProviderFormMode = 'create' | 'edit';

/** AI 产商表单数据。 */
export interface ProviderFormModel {
  id?: number
  provider_name: string
  base_url: string
  apiKey: string
}

/** 以新增模式打开产商弹窗的选项。 */
export interface ProviderDialogCreateOptions {
  mode?: 'create'
}

/** 以编辑模式打开产商弹窗的选项。 */
export interface ProviderDialogEditOptions {
  mode: 'edit'
  row: Api.Ai.ProviderResponse
}

/** 打开产商弹窗的选项。 */
export type ProviderDialogOpenOptions = ProviderDialogCreateOptions | ProviderDialogEditOptions;

/** AI 模型表单的编辑模式。 */
export type ModelFormMode = 'create' | 'edit';

/** AI 模型表单数据。 */
export interface ModelFormModel {
  id?: number
  provider_id: number
  model_name: string
}

/** 以新增模式打开模型弹窗的选项。 */
export interface ModelDialogCreateOptions {
  mode: 'create'
  providerId: number
}

/** 以编辑模式打开模型弹窗的选项。 */
export interface ModelDialogEditOptions {
  mode: 'edit'
  providerId: number
  row: Api.Ai.ModelResponse
}

/** 打开模型弹窗的选项。 */
export type ModelDialogOpenOptions = ModelDialogCreateOptions | ModelDialogEditOptions;
