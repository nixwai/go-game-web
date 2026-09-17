<script setup lang="ts">
import { computed } from 'vue';
import { formatPlayer } from '@/utils/format';

const props = defineProps<{
  /** 当前执棋方。 */
  currentPlayer: -1 | 1
  /** 双方已落子的手数。 */
  moveCount: number
  /** AI 是否正在思考。 */
  isAIThinking: boolean
  /** AI 调用失败时的提示。 */
  aiError: string
}>();

defineEmits<{
  /** 请求重新发起上一次 AI 落子。 */
  (e: 'retry'): void
}>();

const playerText = computed(() => formatPlayer(props.currentPlayer));
const playerIsBlack = computed(() => props.currentPlayer === 1);
</script>

<template>
  <div class="game-status flex flex-col gap-2.25">
    <div class="flex gap-2.5 items-center p-3 bg-mc-paper-50 border border-mc-neutral-200/80 rounded-xl">
      <div class="turn-stone w-7.25 h-7.25 bg-mc-stone-950 border border-mc-stone-950 rounded-full shadow-[1px_2px_4px] shadow-mc-stone-950/23 dark:!bg-[#1c1d1a] dark:!border-[#1c1d1a] dark:shadow-[#1c1d1a]/23" :class="{ '!bg-mc-paper-0 !border-mc-stone-200 dark:!bg-[#fff] dark:!border-[#cacbc4]': !playerIsBlack }" aria-hidden="true" />
      <div class="turn-copy flex flex-1 flex-col gap-0.5">
        <span class="text-xs font-[650] text-mc-neutral-380">当前执棋</span>
        <strong class="text-lg font-[780] text-mc-ink-950">{{ playerText }}</strong>
      </div>
      <span class="text-2xl font-[700] text-mc-sage-600" aria-hidden="true">↗</span>
    </div>
    <div class="status-grid grid grid-cols-[1fr] gap-2.25">
      <div class="flex items-center justify-between p-2.5 bg-mc-paper-50/58 rounded-lg">
        <span class="text-xs font-[650] text-mc-neutral-380">手数</span>
        <strong class="text-lg font-[780] text-mc-ink-950">{{ props.moveCount }}</strong>
      </div>
    </div>
    <div
      class="status-message flex gap-1.75 items-center px-2.5 py-2.25 text-sm font-[700] text-mc-sage-680 bg-mc-sage-100 rounded-md"
      :class="{
        '!items-start !text-mc-danger-600 !bg-mc-danger-150': Boolean(props.aiError),
        '!text-mc-ochre-650 !bg-mc-ochre-100': props.isAIThinking && !props.aiError,
      }"
      :role="props.aiError ? 'alert' : undefined"
      :aria-live="props.aiError ? 'assertive' : undefined"
    >
      <i class="w-1.5 h-1.5 bg-mc-sage-450 rounded-full" :class="{ 'flex-none mt-1 !bg-mc-danger-600': Boolean(props.aiError), '!bg-mc-ochre-450': props.isAIThinking && !props.aiError }" />
      <span class="status-copy flex-1">
        {{ props.aiError || (props.isAIThinking ? 'AI 正在思考下一步' : '对弈中') }}
      </span>
      <button v-if="props.aiError" class="flex-none px-1.5 py-0.5 text-xs font-[750] text-mc-danger-600 cursor-pointer bg-mc-transparent border border-mc-danger-600 rounded-xs hover:text-mc-paper-0 hover:bg-mc-danger-600" type="button" @click="$emit('retry')">
        重试
      </button>
    </div>
  </div>
</template>
