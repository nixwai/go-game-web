<script setup lang="ts">
import { GoHistoryButton, GoHistorySlider } from '@go-board/design';
import { HISTORY_ACTION_CLASS } from '../config/constants';

defineProps<{
  /** 是否禁止停一手。 */
  disabled: boolean
}>();

const emit = defineEmits<{
  /** 停一手时触发。 */
  (e: 'pass'): void
}>();
</script>

<template>
  <div class="flex flex-col">
    <div class="flex gap-2 items-center mb-2.25 text-md font-[750] text-mc-ink-950">
      棋局历史
      <GoHistorySlider class="flex-1 accent-mc-sage-600" />
    </div>
    <div class="flex gap-2 justify-center mt-3.25">
      <GoHistoryButton
        :class="HISTORY_ACTION_CLASS"
        :step="-1"
        aria-label="后退一步"
      >
        <span aria-hidden="true">←</span> 后退
      </GoHistoryButton>
      <GoHistoryButton
        :class="HISTORY_ACTION_CLASS"
        :step="1"
        aria-label="前进一步"
      >
        前进 <span aria-hidden="true">→</span>
      </GoHistoryButton>
      <button
        :class="HISTORY_ACTION_CLASS"
        type="button"
        :disabled="disabled"
        @click="emit('pass')"
      >
        停一手
      </button>
    </div>
  </div>
</template>
