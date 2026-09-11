<script setup lang="ts">
import type { GoBoardInstance } from '@go-board/design';
import { GoBoard, GoHistoryButton, GoHistorySlider, GoSave } from '@go-board/design';
import { computed, ref } from 'vue';
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

const statusLabel = computed(() => gameStore.gameStatus === 'ended' ? '对局已结束' : '对弈进行中');

function handleToggleCoord() {
  gameStore.showCoord = !gameStore.showCoord;
}
</script>

<template>
  <div class="game-view">
    <section class="game-shell">
      <div class="game-layout">
        <div class="board-column">
          <div class="board-topline">
            <div class="player-pair">
              <span class="player-badge"><i class="stone-dot black" />你 · 黑方</span>
              <span class="versus">VS</span>
              <span class="player-badge"><i class="stone-dot white" />AI · 白方</span>
            </div>
            <span class="status-pill" :class="{ ended: gameStore.gameStatus === 'ended' }">
              <i />{{ statusLabel }}
            </span>
          </div>

          <GoSave>
            <div class="board-stage">
              <GoBoard
                ref="boardRef"
                :init="{ size: gameStore.boardSize }"
                :show-coord="gameStore.showCoord"
                :disabled="gameStore.isAIThinking || gameStore.gameStatus === 'ended'"
                width="620px"
                @move="onMove"
                @update="onUpdate"
              />
            </div>

            <div class="history-panel">
              <div class="history-heading">
                棋局历史
                <GoHistorySlider :disabled="gameStore.isAIThinking" class="flex-1" />
              </div>
              <div class="history-actions">
                <GoHistoryButton :step="-1" :disabled="gameStore.isAIThinking" aria-label="后退一步">
                  <span aria-hidden="true">←</span> 后退
                </GoHistoryButton>
                <GoHistoryButton :step="1" :disabled="gameStore.isAIThinking" aria-label="前进一步">
                  前进 <span aria-hidden="true">→</span>
                </GoHistoryButton>
                <GoHistoryButton :step="0" :disabled="gameStore.isAIThinking" aria-label="清空棋局历史">
                  清空历史
                </GoHistoryButton>
              </div>
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
    </section>
  </div>
</template>

<style scoped>
.game-view {
  padding: 0 20px;
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

.board-topline {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  width: 620px;
  margin: 0 auto 13px;
}

.player-pair {
  display: flex;
  gap: 11px;
  align-items: center;
  font-size: 12px;
  font-weight: 650;
  color: var(--muted);
}

.player-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.versus {
  font-size: 10px;
  font-weight: 800;
  color: var(--soft-muted);
  letter-spacing: 0.08em;
}

.stone-dot {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.stone-dot.black {
  background: #1c1d1a;
  box-shadow: 1px 1px 2px rgb(0 0 0 / 24%);
}

.stone-dot.white {
  background: #fff;
  border: 1px solid #c8c8c0;
  box-shadow: 1px 1px 2px rgb(0 0 0 / 12%);
}

.status-pill {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 750;
  color: var(--sage-dark);
  background: var(--sage-soft);
  border-radius: 99px;
}

.status-pill i {
  width: 6px;
  height: 6px;
  background: #5c9b6c;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgb(92 155 108 / 14%);
}

.status-pill.ended {
  color: var(--danger);
  background: #f4e4df;
}

.status-pill.ended i {
  background: var(--danger);
  box-shadow: 0 0 0 3px rgb(169 88 77 / 12%);
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
