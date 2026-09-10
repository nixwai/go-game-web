import type { GoBoardInstance, GoGameSnapshot, KoInfo } from '@go-board/design';
import type { BoardSize } from '@/constants/app';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import { BOARD_SIZES } from '@/constants/app';
import { SetupStoreId } from '@/enum';
import { fetchAnalyzeGoGame, fetchGoGameSetting, fetchUpdateGoGameSetting } from '@/service/api';

export const useGameStore = defineStore(SetupStoreId.Game, () => {
  const boardSize = ref<BoardSize>(9);
  const showCoord = ref(false);
  const aiEnabled = ref(true);
  const isAIThinking = ref(false);
  const gameStatus = ref<'playing' | 'ended'>('playing');
  const passCount = ref(0);
  const snapshot = shallowRef<GoGameSnapshot | null>(null);
  const setting = ref<Api.AiGo.GameSettingResponse | null>(null);

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

  function initGame() {
    gameStatus.value = 'playing';
    passCount.value = 0;
    isAIThinking.value = false;
  }

  function onMove(boardRef: { value?: GoBoardInstance | null }, snap: GoGameSnapshot) {
    snapshot.value = snap;

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

  async function triggerAI(
    boardRef: { value?: GoBoardInstance | null },
    snap: GoGameSnapshot,
  ) {
    if (isAIThinking.value) {
      return;
    }

    isAIThinking.value = true;

    try {
      const ko: KoInfo | undefined = snap.ko
        ? { sign: snap.ko.sign as -1 | 1, vertex: snap.ko.vertex }
        : undefined;

      const { data, error } = await fetchAnalyzeGoGame({
        size: snap.size,
        layout: snap.layout,
        player: snap.player,
        ko,
        latestVertex: snap.latestVertex,
      });

      if (error || !data) {
        return;
      }

      if (data.action === 'move' && data.vertex) {
        boardRef.value?.play(data.vertex);
      }
      else if (data.action === 'end_game') {
        gameStatus.value = 'ended';
      }
    }
    finally {
      isAIThinking.value = false;
    }
  }

  function pass(boardRef: { value?: GoBoardInstance | null }) {
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

  function newGame(boardRef: { value?: GoBoardInstance | null }) {
    boardRef.value?.reset({ size: boardSize.value });
    gameStatus.value = 'playing';
    passCount.value = 0;
    isAIThinking.value = false;
    snapshot.value = null;
  }

  function setBoardSize(size: BoardSize, boardRef: { value?: GoBoardInstance | null }) {
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
    gameStatus,
    passCount,
    snapshot,
    setting,
    currentPlayer,
    moveCount,
    fetchSetting,
    updateSetting,
    switchModel,
    initGame,
    onMove,
    triggerAI,
    pass,
    resign,
    newGame,
    setBoardSize,
  };
});
