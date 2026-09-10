import { request } from '../request';

/** 获取围棋对弈配置。 */
export function fetchGoGameSetting() {
  return request.get<Api.AiGo.GameSettingResponse>({ url: '/api/v1/ai/go/setting' });
}

/** 更新围棋对弈配置。 */
export function fetchUpdateGoGameSetting(data: Api.AiGo.UpdateGameSettingPayload) {
  return request.post<Api.AiGo.GameSettingResponse>({
    url: '/api/v1/ai/go/setting/update',
    data,
  });
}

/** 分析棋局，获取 AI 下一步。 */
export function fetchAnalyzeGoGame(data: Api.AiGo.AnalyzeRequest) {
  return request.post<Api.AiGo.AnalyzeResult>({
    url: '/api/v1/ai/go/analyze',
    data,
  });
}
