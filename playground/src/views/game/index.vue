<script setup lang="ts">
import type { GoBoardInstance } from '@go-board/design';
import { GoBoard, GoHistoryButton, GoHistorySlider, GoSave } from '@go-board/design';
import { onMounted, ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';
import BoardSizeSelector from './components/board-size-selector.vue';
import BoardTopline from './components/board-topline.vue';
import CoordinateToggle from './components/coordinate-toggle.vue';
import GameActionButtons from './components/game-action-buttons.vue';
import GameSidebar from './components/game-sidebar.vue';
import GameStatus from './components/game-status.vue';
import ModelSelector from './components/model-selector.vue';
import { useGoGame } from './hooks/use-go-game';

defineOptions({ name: 'GameView' });

const boardRef = ref<GoBoardInstance | null>(null);
const coord = ref(false);
const aiStore = useAIStore();

const {
  boardSize,
  aiEnabled,
  isAIThinking,
  aiError,
  gameStatus,
  passCount,
  currentPlayer,
  moveCount,
  initGame,
  onMove,
  onUpdate,
  retryAI,
  handlePass,
  handleResign,
  handleNewGame,
  handleBoardSizeChange,
} = useGoGame(boardRef);

function handleToggleAI() {
  aiEnabled.value = !aiEnabled.value;
}

onMounted(async () => {
  await aiStore.fetchProviders();
  initGame();
});
</script>

<template>
  <div class="game-view">
    <section class="game-shell">
      <div class="game-layout">
        <div class="board-column">
          <BoardTopline :game-status="gameStatus" />

          <GoSave>
            <div class="board-stage">
              <GoBoard
                ref="boardRef"
                :init="{ size: boardSize }"
                :show-coord="coord"
                :disabled="isAIThinking || gameStatus === 'ended'"
                width="620px"
                @move="onMove"
                @update="onUpdate"
              />
            </div>

            <div class="history-panel">
              <div class="history-heading">
                棋局历史
                <GoHistorySlider :disabled="isAIThinking" class="flex-1" />
              </div>
              <div class="history-actions">
                <GoHistoryButton :step="-1" :disabled="isAIThinking" aria-label="后退一步">
                  <span aria-hidden="true">←</span> 后退
                </GoHistoryButton>
                <GoHistoryButton :step="1" :disabled="isAIThinking" aria-label="前进一步">
                  前进 <span aria-hidden="true">→</span>
                </GoHistoryButton>
                <GoHistoryButton :step="0" :disabled="isAIThinking" aria-label="清空棋局历史">
                  清空历史
                </GoHistoryButton>
              </div>
            </div>
          </GoSave>
        </div>

        <GameSidebar>
          <template #status>
            <GameStatus
              :current-player="currentPlayer"
              :move-count="moveCount"
              :pass-count="passCount"
              :game-status="gameStatus"
              :is-a-i-thinking="isAIThinking"
              :ai-error="aiError"
              @retry="retryAI"
            />
          </template>
          <template #ai>
            <ModelSelector
              :ai-enabled="aiEnabled"
              :is-a-i-thinking="isAIThinking"
              @toggle-a-i="handleToggleAI"
            />
          </template>
          <template #controls>
            <div class="game-controls">
              <BoardSizeSelector
                :board-size="boardSize"
                :disabled="isAIThinking || gameStatus === 'ended'"
                @board-size-change="handleBoardSizeChange"
              />
              <CoordinateToggle v-model:coord="coord" />
              <GameActionButtons
                :pass-disabled="isAIThinking || gameStatus === 'ended'"
                :resign-disabled="gameStatus === 'ended'"
                @pass="handlePass"
                @resign="handleResign"
                @new-game="handleNewGame"
              />
            </div>
          </template>
        </GameSidebar>
      </div>
    </section>
  </div>
</template>

<style scoped>
.game-view {
  padding: 0 20px;
}

.game-controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.game-shell {
  min-width: 1078px;
  padding: 24px 52px;
  margin: 0 auto 20px;
  background: rgb(255 253 248 / 90%);
  border: 1px solid rgb(255 255 255 / 76%);
  border-radius: 28px;
  box-shadow:
    0 26px 70px rgb(92 91 69 / 14%),
    0 2px 8px rgb(92 91 69 / 4%);
}

h1 {
  margin: 0;
  font-size: 52px;
  font-weight: 780;
  line-height: 1;
  color: var(--ink);
  letter-spacing: -0.065em;
}

.game-layout {
  display: grid;
  grid-template-columns: auto 280px;
  gap: 46px;
  align-items: start;
}

.board-stage {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 20px;
}

:deep(.chessboard) {
  width: 620px !important;
  border-color: rgb(128 90 26 / 84%);
  border-radius: 20px;
  box-shadow: 0 4px 14px rgb(90 63 18 / 10%);
}

.history-panel {
  width: 620px;
  margin: 8px auto 0;
}

.history-heading {
  display: flex;
  gap: 8px;
  margin-bottom: 9px;
  font-size: 13px;
  font-weight: 750;
  color: var(--ink);
}

.history-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--soft-muted);
}

:deep(.go-history-slider) {
  accent-color: var(--sage);
}

.history-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 13px;
}

:deep(.go-history-button) {
  min-height: 36px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 750;
  color: var(--sage-dark);
  background: var(--sage-soft);
  border: 0;
  border-radius: 99px;
  transition:
    color 160ms ease,
    background 160ms ease,
    transform 160ms ease,
    opacity 160ms ease;
}

:deep(.go-history-button:not(:disabled):hover) {
  color: #fff;
  background: var(--sage);
  transform: translateY(-1px);
}

:deep(.go-history-button:disabled) {
  opacity: 0.42;
}
</style>
