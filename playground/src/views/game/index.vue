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

/** 当前对局已落子的手数。 */
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

/** 开启 AI 后若轮到白方，立即请求 AI 落子。 */
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
  <div class="game-view px-[20px]">
    <section class="game-shell">
      <div class="game-layout grid grid-cols-[auto_280px] gap-[46px] items-start">
        <div class="board-column">
          <BoardTopline />

          <GoSave v-model:value="history">
            <div class="board-stage flex justify-center w-full pb-[20px]">
              <GoBoard
                ref="boardRef"
                class="game-board !w-[620px] !border-[rgb(128_90_26_/_84%)] !rounded-[20px] !shadow-[0_4px_14px_rgb(90_63_18_/_10%)]"
                :init="{ size: boardSize }"
                :show-coord="coord"
                :disabled="isAIThinking"
                width="620px"
                @move="onMove"
                @update="onUpdate"
              />
            </div>

            <div class="history-panel w-[620px] mx-auto mt-[8px]">
              <div class="history-heading">
                棋局历史
                <GoHistorySlider :disabled="isAIThinking" class="game-history-slider flex-1 [accent-color:var(--sage)]" />
              </div>
              <div class="history-actions flex gap-[8px] justify-center mt-[13px]">
                <GoHistoryButton
                  class="history-action-button [&:not(:disabled):hover]:!text-[#fff] [&:not(:disabled):hover]:!bg-[var(--sage)] [&:not(:disabled):hover]:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-[0.42]"
                  :step="-1"
                  :disabled="isAIThinking"
                  aria-label="后退一步"
                >
                  <span aria-hidden="true">←</span> 后退
                </GoHistoryButton>
                <GoHistoryButton
                  class="history-action-button [&:not(:disabled):hover]:!text-[#fff] [&:not(:disabled):hover]:!bg-[var(--sage)] [&:not(:disabled):hover]:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-[0.42]"
                  :step="1"
                  :disabled="isAIThinking"
                  aria-label="前进一步"
                >
                  前进 <span aria-hidden="true">→</span>
                </GoHistoryButton>
                <button class="history-action-button [&:not(:disabled):hover]:!text-[#fff] [&:not(:disabled):hover]:!bg-[var(--sage)] [&:not(:disabled):hover]:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-[0.42]" type="button" :disabled="isAIThinking" @click="handlePass">
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
            <div class="game-controls flex flex-col gap-[14px]">
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

.history-heading {
  display: flex;
  gap: 8px;
  margin-bottom: 9px;
  font-size: 13px;
  font-weight: 750;
  color: var(--ink);
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
</style>
