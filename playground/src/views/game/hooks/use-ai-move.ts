import type { GoBoardInstance, GoGamePosition, GoGameSnapshot } from '@go-board/design';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { fetchAnalyzeGoGame } from '@/service/api';

/** AI 返回的落子位置无效时的提示。 */
const AI_INVALID_MOVE_ERROR = 'AI 返回的下棋位置无效，请重试';
/** AI 返回未知动作时的提示。 */
const AI_INVALID_RESPONSE_ERROR = 'AI 返回了无效的响应，请重试';
/** AI 主动结束对局时的提示。 */
const AI_END_GAME_MESSAGE = 'AI申请结束';
/** 请求失败时的兜底提示。 */
const AI_REQUEST_ERROR = 'AI 请求失败，请重试';
/** 单次落子的最大重试次数。 */
const AI_MAX_RETRIES = 10;

/** 单次 AI 落子请求的结果。 */
type AIMoveResponse = { status: 'moved', vertex: GoGamePosition } | { status: 'ended' } | { status: 'failed', message: string };

/** 提取错误中的提示，无法识别时返回兜底文案。 */
function getAIErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return AI_REQUEST_ERROR;
}

/** 请求一次 AI 落子并校验响应。 */
async function requestAIMove(snapshot: GoGameSnapshot): Promise<AIMoveResponse> {
  const ko = snapshot.ko && snapshot.ko.sign !== 0
    ? { sign: snapshot.ko.sign, vertex: snapshot.ko.vertex }
    : undefined;

  try {
    const { data, error } = await fetchAnalyzeGoGame({
      size: snapshot.size,
      layout: snapshot.layout,
      player: snapshot.player,
      ko,
      latestVertex: snapshot.latestVertex,
    });

    if (error || !data) {
      return { status: 'failed', message: getAIErrorMessage(error) };
    }

    if (data.action === 'end_game') {
      return { status: 'ended' };
    }

    if (data.action !== 'move') {
      return { status: 'failed', message: AI_INVALID_RESPONSE_ERROR };
    }

    if (!data.vertex) {
      return { status: 'failed', message: AI_INVALID_MOVE_ERROR };
    }

    return { status: 'moved', vertex: data.vertex };
  }
  catch (error) {
    return { status: 'failed', message: getAIErrorMessage(error) };
  }
}

/** 调度 AI 落子：自动重试失败请求，并丢弃已失效请求的结果。 */
export function useAIMove(boardRef: Ref<GoBoardInstance | null>) {
  const thinking = ref(false);
  const error = ref('');
  /** 递增后使进行中的请求结果失效。 */
  let requestId = 0;

  /** 清除失败提示。 */
  function clearError() {
    error.value = '';
  }

  /** 使进行中的请求失效并复位落子状态。 */
  function cancel() {
    requestId++;
    thinking.value = false;
    clearError();
  }

  /** 在棋盘上落子，棋盘拒绝时返回 false。 */
  function playVertex(vertex: GoGamePosition): boolean {
    try {
      return boardRef.value?.play(vertex) ?? false;
    }
    catch {
      return false;
    }
  }

  /** 请求 AI 落子并落到棋盘；失败时自动重试，达到上限后保留提示。 */
  async function move(snapshot: GoGameSnapshot): Promise<boolean> {
    if (thinking.value) {
      return false;
    }

    thinking.value = true;
    clearError();
    const currentRequestId = ++requestId;

    try {
      let lastMessage = AI_REQUEST_ERROR;

      // 请求失败或落子无效时重试，直到达到上限
      for (let attempt = 0; attempt <= AI_MAX_RETRIES; attempt++) {
        if (currentRequestId !== requestId) {
          return false;
        }

        const response = await requestAIMove(snapshot);

        if (currentRequestId !== requestId) {
          return false;
        }

        if (response.status === 'ended') {
          error.value = AI_END_GAME_MESSAGE;
          return false;
        }

        if (response.status === 'failed') {
          lastMessage = response.message;
          continue;
        }

        if (!playVertex(response.vertex)) {
          lastMessage = AI_INVALID_MOVE_ERROR;
          continue;
        }

        return true;
      }

      if (currentRequestId === requestId) {
        error.value = lastMessage;
      }

      return false;
    }
    finally {
      if (currentRequestId === requestId) {
        thinking.value = false;
      }
    }
  }

  return {
    thinking,
    error,
    clearError,
    cancel,
    move,
  };
}
