import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import type { Ref } from 'vue';
import type { BoardSize } from '@/constants/app';
import { onMounted, watch } from 'vue';
import { useAIStore } from '@/store/modules/ai';
import { useGameStore } from '@/store/modules/game';

export function useGoGame(boardRef: Ref<GoBoardInstance | null>) {
  const gameStore = useGameStore();
  const aiStore = useAIStore();

  onMounted(async () => {
    await gameStore.fetchSetting();
    await aiStore.fetchProviders();
    gameStore.initGame();
  });

  function onMove(snapshot: GoGameSnapshot) {
    gameStore.onMove(boardRef, snapshot);
  }

  function onUpdate(snapshot: GoGameSnapshot) {
    gameStore.snapshot = snapshot;
  }

  function handlePass() {
    gameStore.pass(boardRef);
  }

  function handleResign() {
    gameStore.resign();
  }

  function handleNewGame() {
    gameStore.newGame(boardRef);
  }

  function handleBoardSizeChange(size: BoardSize) {
    gameStore.setBoardSize(size, boardRef);
  }

  function handleModelChange(modelId: number) {
    void gameStore.switchModel(modelId);
  }

  watch(
    () => gameStore.aiEnabled,
    (enabled) => {
      if (enabled && gameStore.snapshot?.player === -1 && gameStore.gameStatus === 'playing') {
        void gameStore.triggerAI(boardRef, gameStore.snapshot);
      }
    },
  );

  return {
    gameStore,
    aiStore,
    onMove,
    onUpdate,
    handlePass,
    handleResign,
    handleNewGame,
    handleBoardSizeChange,
    handleModelChange,
  };
}
