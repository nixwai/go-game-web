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
  <div class="game-view px-5">
    <section class="min-w-game-shell px-13 py-6 mx-auto mb-5 bg-mc-paper-50/90 border border-mc-paper-0/76 rounded-6xl shadow-shell">
      <div class="game-layout grid grid-cols-[auto_280px] gap-11.5 items-start">
        <div class="board-column">
          <BoardTopline />

          <GoSave v-model:value="history" :disabled="isAIThinking">
            <div class="board-stage flex justify-center w-full pb-5">
              <GoBoard
                ref="boardRef"
                class="game-board !w-board !border-mc-board-800/84 !rounded-4xl !shadow-board"
                :init="{ size: boardSize }"
                :show-coord="coord"
                width="620px"
                @move="onMove"
                @update="onUpdate"
              />
            </div>

            <div class="w-board mx-auto mt-2">
              <div class="flex gap-2 items-center mb-2.25 text-md font-[750] text-mc-ink-950">
                棋局历史
                <GoHistorySlider class="game-history-slider flex-1 accent-mc-sage-600" />
              </div>
              <div class="history-actions flex gap-2 justify-center mt-3.25">
                <GoHistoryButton
                  class="history-action-button min-h-9 px-3.5 text-base font-[750] text-mc-sage-680 cursor-pointer bg-mc-sage-100 border-0 rounded-pill transition-all [&:not(:disabled):hover]:!text-mc-paper-0 [&:not(:disabled):hover]:!bg-mc-sage-600 [&:not(:disabled):hover]:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-[0.42]"
                  :step="-1"
                  aria-label="后退一步"
                >
                  <span aria-hidden="true">←</span> 后退
                </GoHistoryButton>
                <GoHistoryButton
                  class="history-action-button min-h-9 px-3.5 text-base font-[750] text-mc-sage-680 cursor-pointer bg-mc-sage-100 border-0 rounded-pill transition-all [&:not(:disabled):hover]:!text-mc-paper-0 [&:not(:disabled):hover]:!bg-mc-sage-600 [&:not(:disabled):hover]:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-[0.42]"
                  :step="1"
                  aria-label="前进一步"
                >
                  前进 <span aria-hidden="true">→</span>
                </GoHistoryButton>
                <button
                  class="history-action-button min-h-9 px-3.5 text-base font-[750] text-mc-sage-680 cursor-pointer bg-mc-sage-100 border-0 rounded-pill transition-all [&:not(:disabled):hover]:!text-mc-paper-0 [&:not(:disabled):hover]:!bg-mc-sage-600 [&:not(:disabled):hover]:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-[0.42]"
                  type="button"
                  :disabled="isAIThinking"
                  @click="handlePass"
                >
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
            <div class="game-controls flex flex-col gap-3.5">
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
