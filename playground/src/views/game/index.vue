<script setup lang="ts">
import type { GoBoardInstance, GoGameOptions } from '@go-board/design';
import { GoBoard, GoSave } from '@go-board/design';
import { computed, onMounted, ref } from 'vue';
import BoardSizeSelector from './components/board-size-selector.vue';
import BoardTopline from './components/board-topline.vue';
import CoordinateToggle from './components/coordinate-toggle.vue';
import GameActionButtons from './components/game-action-buttons.vue';
import GameHistoryControls from './components/game-history-controls.vue';
import GameSidebar from './components/game-sidebar.vue';
import GameStatus from './components/game-status.vue';
import ModelSelector from './components/model-selector.vue';
import { useGoGame } from './hooks/use-go-game';

defineOptions({ name: 'GameView' });

const boardRef = ref<GoBoardInstance | null>(null);
const coord = ref(false);
const history = ref<GoGameOptions[]>([]);

/** 当前对局已落子的手数。 */
const moveCount = computed(() => Math.max(history.value.length - 1, 0));

const {
  boardSize,
  aiEnabled,
  isAIThinking,
  aiError,
  currentPlayer,
  initGame,
  retryAI,
  toggleAI,
  onMove,
  onUpdate,
  handlePass,
  handleNewGame,
} = useGoGame(boardRef);

onMounted(initGame);
</script>

<template>
  <div class="px-5">
    <section class="min-w-game-shell px-13 py-6 mx-auto mb-5 bg-mc-paper-50/90 border border-mc-paper-0/76 rounded-6xl shadow-shell">
      <div class="grid grid-cols-[auto_280px] gap-11.5 items-start">
        <div>
          <BoardTopline />

          <GoSave v-model:value="history" :disabled="isAIThinking">
            <div class="flex justify-center w-full pb-5">
              <GoBoard
                ref="boardRef"
                class="!w-board !border-mc-board-800/84 !rounded-4xl !shadow-board"
                :init="{ size: boardSize }"
                :show-coord="coord"
                width="620px"
                @move="onMove"
                @update="onUpdate"
              />
            </div>

            <GameHistoryControls
              class="w-board mx-auto mt-2"
              :disabled="isAIThinking"
              @pass="handlePass"
            />
          </GoSave>
        </div>

        <GameSidebar>
          <template #status>
            <GameStatus
              :current-player="currentPlayer"
              :move-count="moveCount"
              :is-a-i-thinking="isAIThinking"
              :ai-error="aiError"
              @retry="retryAI"
            />
          </template>
          <template #ai>
            <ModelSelector
              :ai-enabled="aiEnabled"
              :is-a-i-thinking="isAIThinking"
              @toggle-a-i="toggleAI"
            />
          </template>
          <template #controls>
            <div class="flex flex-col gap-3.5">
              <CoordinateToggle v-model:coord="coord" />
              <BoardSizeSelector v-model:board-size="boardSize" :disabled="isAIThinking" />
              <GameActionButtons @new-game="handleNewGame" />
            </div>
          </template>
        </GameSidebar>
      </div>
    </section>
  </div>
</template>
