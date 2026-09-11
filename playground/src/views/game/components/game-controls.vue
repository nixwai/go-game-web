<script setup lang="ts">
import type { BoardSize } from '@/constants/app';
import { computed } from 'vue';
import { useGameStore } from '@/store/modules/game';
import { BOARD_SIZE_OPTIONS } from '../config/constants';

const emit = defineEmits<Emits>();
const gameStore = useGameStore();

interface Emits {
  (e: 'pass'): void
  (e: 'resign'): void
  (e: 'newGame'): void
  (e: 'boardSizeChange', size: BoardSize): void
  (e: 'toggleCoord'): void
}

const disabled = computed(() => gameStore.isAIThinking || gameStore.gameStatus === 'ended');
</script>

<template>
  <div class="game-controls">
    <div class="preference-row">
      <div>
        <span class="preference-label">棋盘尺寸</span>
        <small>选择你的对弈规格</small>
      </div>
      <select
        class="select-control"
        :value="gameStore.boardSize"
        :disabled="disabled"
        aria-label="选择棋盘尺寸"
        @change="emit('boardSizeChange', Number(($event.target as HTMLSelectElement).value) as BoardSize)"
      >
        <option v-for="opt in BOARD_SIZE_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>
    <div class="preference-row">
      <div>
        <span class="preference-label">显示坐标</span>
        <small>辅助定位落子位置</small>
      </div>
      <button
        class="toggle-control"
        :class="{ enabled: gameStore.showCoord }"
        type="button"
        :aria-pressed="gameStore.showCoord"
        @click="emit('toggleCoord')"
      >
        <span />{{ gameStore.showCoord ? '开启' : '关闭' }}
      </button>
    </div>
    <div class="action-grid">
      <button class="action-button secondary" type="button" :disabled="disabled" @click="emit('pass')">
        停一着
      </button>
      <button
        class="action-button danger"
        type="button"
        :disabled="gameStore.gameStatus === 'ended'"
        @click="emit('resign')"
      >
        认输
      </button>
      <button class="action-button primary" type="button" @click="emit('newGame')">
        <span aria-hidden="true">＋</span> 新局
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.preference-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.preference-row > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.preference-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

.preference-row small {
  font-size: 10px;
  color: var(--soft-muted);
}

.select-control,
.toggle-control {
  min-height: 32px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
  outline: none;
  background: var(--paper);
  border: 1px solid rgb(65 104 78 / 18%);
  border-radius: 9px;
}

.select-control {
  max-width: 100px;
  padding: 0 8px;
  cursor: pointer;
}

.select-control:focus {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgb(65 104 78 / 10%);
}

.toggle-control {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 0 9px;
  color: var(--soft-muted);
  cursor: pointer;
}

.toggle-control span {
  width: 6px;
  height: 6px;
  background: #b5b9ae;
  border-radius: 50%;
}

.toggle-control.enabled {
  color: var(--sage-dark);
  background: var(--sage-soft);
  border-color: transparent;
}

.toggle-control.enabled span {
  background: #589066;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding-top: 3px;
}

.action-button {
  min-height: 38px;
  padding: 0 9px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  border: 0;
  border-radius: 11px;
  transition:
    color 160ms ease,
    background 160ms ease,
    opacity 160ms ease,
    transform 160ms ease;
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.action-button:active:not(:disabled) {
  transform: translateY(1px);
}

.action-button.secondary {
  color: var(--sage-dark);
  background: var(--sage-soft);
}

.action-button.secondary:hover:not(:disabled) {
  color: #fff;
  background: var(--sage);
}

.action-button.danger {
  color: var(--danger);
  background: #f4e4df;
}

.action-button.danger:hover:not(:disabled) {
  color: #fff;
  background: var(--danger);
}

.action-button.primary {
  grid-column: 1 / -1;
  color: #fffdf8;
  background: var(--sage);
  box-shadow: 0 7px 14px rgb(65 104 78 / 18%);
}

.action-button.primary:hover {
  background: var(--sage-dark);
}
</style>
