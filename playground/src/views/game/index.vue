<script setup lang="ts">
import type { GoBoardInstance, GoGameOptions } from '@go-board/design';
import type { BoardSize } from '@/constants/app';
import { GoBoard, GoHistoryButton, GoHistorySlider, GoSave } from '@go-board/design';
import { computed, onMounted, ref } from 'vue';
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

const boardSize = ref<BoardSize>(9);
const boardRef = ref<GoBoardInstance | null>(null);
const coord = ref(false);
const history = ref<GoGameOptions[]>([]);
const aiStore = useAIStore();

const moveCount = computed(() => Math.max(history.value.length - 1, 0));

const {
  aiEnabled,
  isAIThinking,
  aiError,
  currentPlayer,
  initGame,
  onMove,
  onUpdate,
  handleRetryAI,
  handlePass,
  handleNewGame,
} = useGoGame(boardRef);

function handleToggleAI() {
  aiEnabled.value = !aiEnabled.value;

  if (aiEnabled.value && currentPlayer.value === -1) {
    handleRetryAI();
  }
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
          <BoardTopline />

          <GoSave v-model:value="history">
            <div class="board-stage">
              <GoBoard
                ref="boardRef"
                class="game-board"
                :init="{ size: boardSize }"
                :show-coord="coord"
                :disabled="isAIThinking"
                width="620px"
                @move="onMove"
                @update="onUpdate"
              />
            </div>

            <div class="history-panel">
              <div class="history-heading">
                棋局历史
                <GoHistorySlider :disabled="isAIThinking" class="game-history-slider flex-1" />
              </div>
              <div class="history-actions">
                <GoHistoryButton
                  class="history-action-button"
                  :step="-1"
                  :disabled="isAIThinking"
                  aria-label="后退一步"
                >
                  <span aria-hidden="true">←</span> 后退
                </GoHistoryButton>
                <GoHistoryButton
                  class="history-action-button"
                  :step="1"
                  :disabled="isAIThinking"
                  aria-label="前进一步"
                >
                  前进 <span aria-hidden="true">→</span>
                </GoHistoryButton>
                <button class="history-action-button" type="button" :disabled="isAIThinking" @click="handlePass">
                  停一手
                </button>
              </div>
            </div>
          </GoSave>
        </div>

        <GameSidebar>
          <template #status>
            <GameStatus
              :current-player="currentPlayer"
              :move-count="moveCount"
              :is-a-i-thinking="isAIThinking"
              :ai-error="aiError"
              @retry="handleRetryAI"
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
              <CoordinateToggle v-model:coord="coord" />
              <BoardSizeSelector v-model:board-size="boardSize" :disabled="isAIThinking" />
              <GameActionButtons @new-game="handleNewGame(boardSize)" />
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

.game-board {
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

.game-history-slider {
  accent-color: var(--sage);
}

.history-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 13px;
}

.history-action-button {
  min-height: 36px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 750;
  color: var(--sage-dark);
  cursor: pointer;
  background: var(--sage-soft);
  border: 0;
  border-radius: 99px;
  transition:
    color 160ms ease,
    background 160ms ease,
    transform 160ms ease,
    opacity 160ms ease;
}

.history-action-button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.history-action-button:not(:disabled):hover {
  color: #fff;
  background: var(--sage);
  transform: translateY(-1px);
}
</style>
