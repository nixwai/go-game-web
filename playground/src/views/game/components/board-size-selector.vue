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
  <div class="flex gap-3 items-center justify-between">
    <div class="flex flex-col gap-0.75">
      <span class="text-md font-[700] text-mc-ink-950">棋盘尺寸</span>
      <small class="text-xs text-mc-neutral-380">选择你的对弈规格</small>
    </div>
    <select
      class="max-w-25 min-h-8 px-2 text-base font-[700] text-mc-ink-950 cursor-pointer outline-none bg-mc-paper-50 border border-mc-sage-600/18 rounded-md focus:border-mc-sage-600 focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-50"
      :value="props.boardSize"
      :disabled="props.disabled"
      aria-label="选择棋盘尺寸"
      @change="emit('update:boardSize', Number(($event.target as HTMLSelectElement).value) as BoardSize)"
    >
      <option
        v-for="opt in BOARD_SIZE_OPTIONS"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
