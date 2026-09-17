<script setup lang="ts">
import type { BoardSize } from '@/constants/app';
import { BOARD_SIZE_OPTIONS } from '../config/constants';

const props = defineProps<{
  /** 当前棋盘边长。 */
  boardSize: BoardSize
  /** 是否禁止修改。 */
  disabled: boolean
}>();

const emit = defineEmits<{
  /** 棋盘边长变更时触发。 */
  (e: 'update:boardSize', size: BoardSize): void
}>();
</script>

<template>
  <div class="preference-row flex gap-[12px] items-center justify-between">
    <div class="flex flex-col gap-[3px]">
      <span class="preference-label text-[13px] font-[700] text-[var(--ink)]">棋盘尺寸</span>
      <small class="text-[10px] text-[var(--soft-muted)]">选择你的对弈规格</small>
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
