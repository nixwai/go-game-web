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
  <div class="game-controls flex flex-col gap-12px">
    <div class="flex items-center justify-between">
      <span class="text-14px font-500">棋盘尺寸</span>
      <select
        class="border border-gray-3 rounded-4px px-8px py-4px text-14px outline-none"
        :value="gameStore.boardSize"
        :disabled="disabled"
        @change="emit('boardSizeChange', Number(($event.target as HTMLSelectElement).value) as BoardSize)"
      >
        <option v-for="opt in BOARD_SIZE_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-14px font-500">显示坐标</span>
      <button
        class="rounded-4px px-8px py-4px text-12px transition-colors"
        :class="gameStore.showCoord ? 'bg-blue-5 text-white' : 'bg-gray-3 text-gray-6'"
        @click="emit('toggleCoord')"
      >
        {{ gameStore.showCoord ? '开' : '关' }}
      </button>
    </div>
    <div class="flex gap-8px pt-4px">
      <button
        class="flex-1 rounded-6px border border-gray-3 px-8px py-8px text-14px transition-colors hover:bg-gray-1 disabled:opacity-50"
        :disabled="disabled"
        @click="emit('pass')"
      >
        停一着
      </button>
      <button
        class="flex-1 rounded-6px border border-red-3 px-8px py-8px text-14px text-red-5 transition-colors hover:bg-red-1 disabled:opacity-50"
        :disabled="gameStore.gameStatus === 'ended'"
        @click="emit('resign')"
      >
        认输
      </button>
      <button
        class="flex-1 rounded-6px bg-blue-5 px-8px py-8px text-14px text-white transition-colors hover:bg-blue-6"
        @click="emit('newGame')"
      >
        新局
      </button>
    </div>
  </div>
</template>
