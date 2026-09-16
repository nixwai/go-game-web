<script setup lang="ts">
import type { BoardSize } from '@/constants/app';
import { BOARD_SIZE_OPTIONS } from '../config/constants';

const props = defineProps<{
  boardSize: BoardSize
  disabled: boolean
}>();

const emit = defineEmits<{
  (e: 'update:boardSize', size: BoardSize): void
}>();
</script>

<template>
  <div class="preference-row">
    <div>
      <span class="preference-label">棋盘尺寸</span>
      <small>选择你的对弈规格</small>
    </div>
    <select
      class="select-control"
      :value="props.boardSize"
      :disabled="props.disabled"
      aria-label="选择棋盘尺寸"
      @change="emit('update:boardSize', Number(($event.target as HTMLSelectElement).value) as BoardSize)"
    >
      <option v-for="opt in BOARD_SIZE_OPTIONS" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
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

.select-control {
  max-width: 100px;
  min-height: 32px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
  cursor: pointer;
  outline: none;
  background: var(--paper);
  border: 1px solid rgb(65 104 78 / 18%);
  border-radius: 9px;
}

.select-control:focus {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgb(65 104 78 / 10%);
}
</style>
