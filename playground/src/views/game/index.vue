<script setup lang="ts">
import type { GoBoardInstance } from '@go-board/design';
import { GoBoard, GoHistoryButton, GoHistorySlider, GoSave } from '@go-board/design';
import { ref } from 'vue';
import GameSidebar from './components/game-sidebar.vue';
import { useGoGame } from './hooks/use-go-game';

defineOptions({ name: 'GameView' });

const boardRef = ref<GoBoardInstance | null>(null);

const {
  gameStore,
  onMove,
  onUpdate,
  handlePass,
  handleResign,
  handleNewGame,
  handleBoardSizeChange,
  handleModelChange,
} = useGoGame(boardRef);

function handleToggleCoord() {
  gameStore.showCoord = !gameStore.showCoord;
}
</script>

<template>
  <div class="game-view flex gap-24px p-24px">
    <div class="flex flex-1 items-start justify-center">
      <GoSave>
        <div class="game-board flex flex-col gap-12px">
          <div class="flex items-center gap-8px">
            <GoHistoryButton :step="-1" :disabled="gameStore.isAIThinking">
              后退
            </GoHistoryButton>
            <GoHistoryButton :step="1" :disabled="gameStore.isAIThinking">
              前进
            </GoHistoryButton>
            <GoHistoryButton :step="0" :disabled="gameStore.isAIThinking">
              清空
            </GoHistoryButton>
          </div>
          <GoBoard
            ref="boardRef"
            :init="{ size: gameStore.boardSize }"
            :show-coord="gameStore.showCoord"
            :disabled="gameStore.isAIThinking"
            width="600px"
            @move="onMove"
            @update="onUpdate"
          />
          <GoHistorySlider :disabled="gameStore.isAIThinking" />
        </div>
      </GoSave>
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
