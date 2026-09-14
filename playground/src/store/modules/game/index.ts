import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import type { Ref } from 'vue';
import type { BoardSize } from '@/constants/app';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import { BOARD_SIZES } from '@/constants/app';
import { SetupStoreId } from '@/enum';
import { fetchAnalyzeGoGame, fetchGoGameSetting, fetchUpdateGoGameSetting } from '@/service/api';

const AI_INVALID_MOVE_ERROR = 'AI 返回的下棋位置无效，请重试';
const AI_INVALID_RESPONSE_ERROR = 'AI 返回了无效的响应，请重试';
const AI_REQUEST_ERROR = 'AI 请求失败，请重试';
const AI_MAX_RETRIES = 10;
type BoardRef = Ref<GoBoardInstance | null> | { value?: GoBoardInstance | null };

function createAnalyzeKo(ko: GoGameSnapshot['ko']): Api.AiGo.KoInfo | undefined {
  if (!ko || (ko.sign !== 1 && ko.sign !== -1)) {
    return undefined;
  }

  const [x, y] = ko.vertex;
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
    return undefined;
  }

  return {
    sign: ko.sign,
    vertex: [x, y],
  };
}

function getAIErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return AI_REQUEST_ERROR;
}

export const useGameStore = defineStore(SetupStoreId.Game, () => {
  const boardSize = ref<BoardSize>(9);
  const showCoord = ref(false);
  const aiEnabled = ref(true);
  const isAIThinking = ref(false);
  const aiError = ref('');
  const gameStatus = ref<'playing' | 'ended'>('playing');
  const passCount = ref(0);
  const snapshot = shallowRef<GoGameSnapshot | null>(null);
  const setting = ref<Api.AiGo.GameSettingResponse | null>(null);
  let aiRequestId = 0;

  const currentPlayer = computed(() => snapshot.value?.player ?? 1);

  const moveCount = computed(() => {
    if (!snapshot.value?.layout) {
      return 0;
    }

    let count = 0;
    for (const row of snapshot.value.layout) {
      for (const cell of row) {
        if (cell !== 0) {
          count++;
        }
      }
    }

    return count;
  });

  async function fetchSetting() {
    const { data, error } = await fetchGoGameSetting();

    if (!error && data) {
      setting.value = data;
    }
  }

  async function updateSetting(data: Api.AiGo.UpdateGameSettingPayload) {
    const { error } = await fetchUpdateGoGameSetting(data);

    if (!error) {
      await fetchSetting();
    }
  }

  async function switchModel(modelId: number) {
    await updateSetting({ active_model_id: modelId });
  }

  function clearAIError() {
    aiError.value = '';
  }

  function initGame() {
    aiRequestId++;
    gameStatus.value = 'playing';
    passCount.value = 0;
    isAIThinking.value = false;
    clearAIError();
  }

  function onMove(boardRef: BoardRef, snap: GoGameSnapshot) {
    snapshot.value = snap;
    clearAIError();

    if (snap.latestVertex) {
      passCount.value = 0;
    }

    if (!aiEnabled.value || gameStatus.value !== 'playing') {
      return;
    }

    if (snap.player === -1) {
      void triggerAI(boardRef, snap);
    }
  }

  async function triggerAI(boardRef: BoardRef, snap: GoGameSnapshot): Promise<boolean> {
    if (isAIThinking.value) {
      return false;
    }

    isAIThinking.value = true;
    snapshot.value = snap;
    clearAIError();
    const requestId = ++aiRequestId;

    try {
      const ko = createAnalyzeKo(snap.ko);
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

          if (data.action === 'move') {
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

          if (data.action === 'end_game') {
            gameStatus.value = 'ended';
            return true;
          }

          lastError = AI_INVALID_RESPONSE_ERROR;
        }
        catch (error) {
          if (requestId !== aiRequestId) {
            return false;
          }

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

  async function retryAI(boardRef: BoardRef): Promise<boolean> {
    const failedSnapshot = snapshot.value;

    if (!aiError.value || !failedSnapshot || failedSnapshot.player !== -1 || gameStatus.value !== 'playing') {
      return false;
    }

    return triggerAI(boardRef, failedSnapshot);
  }

  function pass(boardRef: BoardRef) {
    if (gameStatus.value !== 'playing') {
      return;
    }

    const success = boardRef.value?.play() ?? false;

    if (!success) {
      return;
    }

    passCount.value++;

    if (passCount.value >= 2) {
      gameStatus.value = 'ended';
    }
  }

  function resign() {
    gameStatus.value = 'ended';
  }

  function newGame(boardRef: BoardRef) {
    aiRequestId++;
    boardRef.value?.reset({ size: boardSize.value });
    gameStatus.value = 'playing';
    passCount.value = 0;
    isAIThinking.value = false;
    clearAIError();
    snapshot.value = null;
  }

  function setBoardSize(size: BoardSize, boardRef: BoardRef) {
    if (!BOARD_SIZES.includes(size)) {
      return;
    }

    boardSize.value = size;
    newGame(boardRef);
  }

  return {
    boardSize,
    showCoord,
    aiEnabled,
    isAIThinking,
    aiError,
    gameStatus,
    passCount,
    snapshot,
    setting,
    currentPlayer,
    moveCount,
    fetchSetting,
    updateSetting,
    switchModel,
    clearAIError,
    initGame,
    onMove,
    triggerAI,
    retryAI,
    pass,
    resign,
    newGame,
    setBoardSize,
  };
});
