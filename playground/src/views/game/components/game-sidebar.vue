<script setup lang="ts">
import type { BoardSize } from '@/constants/app';
import GameControls from './game-controls.vue';
import GameStatus from './game-status.vue';
import ModelSelector from './model-selector.vue';

interface Emits {
  (e: 'pass'): void
  (e: 'resign'): void
  (e: 'newGame'): void
  (e: 'boardSizeChange', size: BoardSize): void
  (e: 'toggleCoord'): void
  (e: 'modelChange', modelId: number): void
}

const emit = defineEmits<Emits>();
</script>

<template>
  <aside class="game-sidebar flex w-280px flex-col gap-16px">
    <div class="rounded-8px border border-gray-2 p-12px">
      <h3 class="mb-8px text-16px font-600">
        对局信息
      </h3>
      <GameStatus />
    </div>
    <div class="rounded-8px border border-gray-2 p-12px">
      <h3 class="mb-8px text-16px font-600">
        AI 设置
      </h3>
      <ModelSelector @model-change="emit('modelChange', $event)" />
    </div>
    <div class="rounded-8px border border-gray-2 p-12px">
      <h3 class="mb-8px text-16px font-600">
        操作
      </h3>
      <GameControls
        @pass="emit('pass')"
        @resign="emit('resign')"
        @new-game="emit('newGame')"
        @board-size-change="emit('boardSizeChange', $event)"
        @toggle-coord="emit('toggleCoord')"
      />
    </div>
  </aside>
</template>
