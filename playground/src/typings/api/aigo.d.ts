declare namespace Api {
  namespace AiGo {
    interface KoInfo {
      sign: -1 | 1
      vertex: [number, number]
    }

    interface AnalyzeRequest {
      size: number | string
      layout: number[][]
      player: -1 | 1
      ko?: KoInfo
      latestVertex?: [number, number]
    }

    interface AnalyzeResult {
      action: 'move' | 'end_game'
      vertex?: [number, number]
    }

    interface GameSettingResponse {
      active_model_id: number
      allow_ai_end_game: boolean
      model_name: string
      is_default: boolean
      has_api_key: boolean
    }

    interface UpdateGameSettingPayload {
      active_model_id?: number
      allow_ai_end_game?: boolean
    }
  }
}
