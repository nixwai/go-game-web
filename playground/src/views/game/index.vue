<script setup lang="ts">
import GameBoard from './components/game-board.vue';
import GameSidebar from './components/game-sidebar.vue';
import { useGoGame } from './hooks/use-go-game';

defineOptions({ name: 'GameView' });

const {
  gameStore,
  onMove,
  onUpdate,
  handlePass,
  handleResign,
  handleNewGame,
  handleBoardSizeChange,
  handleModelChange,
} = useGoGame();

function handleToggleCoord() {
  gameStore.showCoord = !gameStore.showCoord;
}
</script>

<template>
  <div class="game-view flex gap-24px p-24px">
    <div class="flex flex-1 items-start justify-center">
      <GameBoard
        :board-size="gameStore.boardSize"
        :show-coord="gameStore.showCoord"
        :disabled="gameStore.isAIThinking"
        @move="onMove"
        @update="onUpdate"
      />
    </div>
    <GameSidebar
      @pass="handlePass"
      @resign="handleResign"
      @new-game="handleNewGame"
      @board-size-change="handleBoardSizeChange"
      @toggle-coord="handleToggleCoord"
      @model-change="handleModelChange"
    />
  </div>
</template>
