import { request } from '../request';

/** 列出当前用户的 AI 产商配置。 */
export function fetchProviderList() {
  return request.get<Api.Ai.ProviderResponse[]>({ url: '/api/v1/ai/providers/list' });
}

/** 新增 AI 产商配置。 */
export function fetchCreateProvider(data: Api.Ai.CreateProviderPayload) {
  return request.post<Api.Ai.ProviderResponse>({
    url: '/api/v1/ai/providers/create',
    data,
  });
}

/** 更新 AI 产商配置。 */
export function fetchUpdateProvider(data: Api.Ai.UpdateProviderPayload) {
  return request.post<Api.Ai.ProviderResponse>({
    url: '/api/v1/ai/providers/update',
    data,
  });
}

/** 删除 AI 产商配置。 */
export function fetchDeleteProvider(data: Api.Ai.DeleteProviderPayload) {
  return request.post<null>({
    url: '/api/v1/ai/providers/delete',
    data,
  });
}

/** 新增 AI 模型。 */
export function fetchCreateModel(data: Api.Ai.CreateModelPayload) {
  return request.post<Api.Ai.ModelResponse>({
    url: '/api/v1/ai/models/create',
    data,
  });
}

/** 更新 AI 模型。 */
export function fetchUpdateModel(data: Api.Ai.UpdateModelPayload) {
  return request.post<Api.Ai.ModelResponse>({
    url: '/api/v1/ai/models/update',
    data,
  });
}

/** 删除 AI 模型。 */
export function fetchDeleteModel(data: Api.Ai.DeleteModelPayload) {
  return request.post<null>({
    url: '/api/v1/ai/models/delete',
    data,
  });
}
