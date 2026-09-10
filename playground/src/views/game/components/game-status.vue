<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/store/modules/game';
import { formatPlayer } from '@/utils/format';

const gameStore = useGameStore();

const playerText = computed(() => formatPlayer(gameStore.currentPlayer));
const statusText = computed(() => {
  if (gameStore.gameStatus === 'ended') {
    return '对局结束';
  }

  return '对弈中';
});
</script>

<template>
  <div class="game-status flex flex-col gap-8px">
    <div class="flex items-center justify-between rounded-6px bg-gray-1 px-12px py-8px">
      <span class="text-14px text-gray-5">当前执棋</span>
      <span class="text-16px font-600">{{ playerText }}</span>
    </div>
    <div class="flex items-center justify-between rounded-6px bg-gray-1 px-12px py-8px">
      <span class="text-14px text-gray-5">手数</span>
      <span class="text-16px font-600">{{ gameStore.moveCount }}</span>
    </div>
    <div
      class="flex items-center justify-between rounded-6px px-12px py-8px"
      :class="gameStore.gameStatus === 'ended' ? 'bg-red-1' : 'bg-green-1'"
    >
      <span class="text-14px text-gray-5">状态</span>
      <span
        class="text-16px font-600"
        :class="gameStore.gameStatus === 'ended' ? 'text-red-6' : 'text-green-6'"
      >{{ statusText }}</span>
    </div>
  </div>
</template>
