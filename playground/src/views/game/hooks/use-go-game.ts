import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import type { Ref } from 'vue';
import type { BoardSize } from '@/constants/app';
import { computed, nextTick, ref, shallowRef } from 'vue';
import { fetchAnalyzeGoGame } from '@/service/api';

const AI_INVALID_MOVE_ERROR = 'AI 返回的下棋位置无效，请重试';
const AI_INVALID_RESPONSE_ERROR = 'AI 返回了无效的响应，请重试';
const AI_END_GAME_MESSAGE = 'AI申请结束';
const AI_REQUEST_ERROR = 'AI 请求失败，请重试';
const AI_MAX_RETRIES = 10;

export function getAIErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return AI_REQUEST_ERROR;
}

export function useGoGame(boardRef: Ref<GoBoardInstance | null>) {
  const aiEnabled = ref(true);
  const isAIThinking = ref(false);
  const aiError = ref('');
  const snapshot = shallowRef<GoGameSnapshot | null>(null);
  let aiRequestId = 0;

  const currentPlayer = computed(() => snapshot.value?.player ?? 1);

  function clearAIError() {
    aiError.value = '';
  }

  function initGame() {
    aiRequestId++;
    isAIThinking.value = false;
    clearAIError();
  }

  function onMove(snap: GoGameSnapshot) {
    snapshot.value = snap;
    clearAIError();

    if (!aiEnabled.value) {
      return;
    }

    if (snap.player === -1) {
      void triggerAI(snap);
    }
  }

  function onUpdate(snap: GoGameSnapshot) {
    clearAIError();
    snapshot.value = snap;
  }

  async function triggerAI(snap: GoGameSnapshot): Promise<boolean> {
    if (isAIThinking.value) {
      return false;
    }

    isAIThinking.value = true;
    snapshot.value = snap;
    clearAIError();
    const requestId = ++aiRequestId;

    try {
      const ko = snap.ko && snap.ko.sign !== 0
        ? { sign: snap.ko.sign, vertex: snap.ko.vertex }
        : undefined;
      let lastError = AI_REQUEST_ERROR;

      for (let attempt = 0; attempt <= AI_MAX_RETRIES; attempt++) {
        if (requestId !== aiRequestId) {
          return false;
        }

        try {
          const { data, error } = await fetchAnalyzeGoGame({
            size: snap.size,
            layout: snap.layout,
            player: snap.player,
            ko,
            latestVertex: snap.latestVertex,
          });

          if (requestId !== aiRequestId) {
            return false;
          }

          if (error || !data) {
            lastError = getAIErrorMessage(error);
            continue;
          }

          if (data.action === 'end_game') {
            aiError.value = AI_END_GAME_MESSAGE;
            return false;
          }

          if (data.action !== 'move') {
            lastError = AI_INVALID_RESPONSE_ERROR;
            continue;
          }

          if (!data.vertex) {
            lastError = AI_INVALID_MOVE_ERROR;
            continue;
          }

          let success = false;
          try {
            success = boardRef.value?.play(data.vertex) ?? false;
          }
          catch {
            success = false;
          }

          if (!success) {
            lastError = AI_INVALID_MOVE_ERROR;
            continue;
          }

          return true;
        }
        catch (error) {
          lastError = getAIErrorMessage(error);
        }
      }

      if (requestId === aiRequestId) {
        aiError.value = lastError;
      }

      return false;
    }
    finally {
      if (requestId === aiRequestId) {
        isAIThinking.value = false;
      }
    }
  }

  async function handleRetryAI(): Promise<boolean> {
    if (snapshot.value) {
      return triggerAI(snapshot.value);
    }
    return false;
  }

  async function handlePass() {
    if (boardRef.value?.play()) {
      await nextTick();
      if (currentPlayer.value === -1) {
        handleRetryAI();
      }
    };
  }

  function handleNewGame(size: BoardSize) {
    aiRequestId++;
    boardRef.value?.reset({ size });
    isAIThinking.value = false;
    clearAIError();
    snapshot.value = null;
  }

  return {
    aiEnabled,
    isAIThinking,
    aiError,
    currentPlayer,
    initGame,
    onMove,
    onUpdate,
    triggerAI,
    handleRetryAI,
    handlePass,
    handleNewGame,
  };
}
