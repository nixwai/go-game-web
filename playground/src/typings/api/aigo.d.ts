declare namespace Api {
  namespace AiGo {
    /** 打劫信息。 */
    interface KoInfo {
      sign: -1 | 1
      vertex: [number, number]
    }

    /** AI 落子分析的请求参数。 */
    interface AnalyzeRequest {
      size: number | string
      layout: number[][]
      player: -1 | 1
      ko?: KoInfo
      latestVertex?: [number, number]
    }

    /** AI 落子分析的结果。 */
    interface AnalyzeResult {
      action: 'move' | 'end_game'
      vertex?: [number, number]
    }

    /** 对局 AI 设置。 */
    interface GameSettingResponse {
      active_model_id: number
      allow_ai_end_game: boolean
      model_name: string
      is_default: boolean
      has_api_key: boolean
    }

    /** 更新对局 AI 设置的请求参数。 */
    interface UpdateGameSettingPayload {
      active_model_id?: number
      allow_ai_end_game?: boolean
    }
  }
}
