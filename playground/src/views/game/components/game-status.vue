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
  <div class="game-status flex flex-col gap-[9px]">
    <div class="turn-card">
      <div class="turn-stone" :class="{ 'white': !playerIsBlack, '!bg-[radial-gradient(circle_at_35%_30%,#fff,#d8d8d0_70%)]': !playerIsBlack, '[border:1px_solid_#c2c4bc]': !playerIsBlack }" aria-hidden="true" />
      <div class="turn-copy flex flex-1 flex-col gap-[2px]">
        <span class="text-[10px] font-[650] text-[var(--soft-muted)]">当前执棋</span>
        <strong class="text-[14px] font-[780] text-[var(--ink)]">{{ playerText }}</strong>
      </div>
      <span class="turn-arrow text-[17px] font-[700] text-[var(--sage)]" aria-hidden="true">↗</span>
    </div>
    <div class="status-grid grid grid-cols-[1fr] gap-[9px]">
      <div class="mini-stat">
        <span class="text-[10px] font-[650] text-[var(--soft-muted)]">手数</span>
        <strong class="text-[14px] font-[780] text-[var(--ink)]">{{ props.moveCount }}</strong>
      </div>
    </div>
    <div
      class="status-message"
      :class="{
        'thinking': props.isAIThinking && !props.aiError,
        'ai-error': Boolean(props.aiError),
        '!items-start !text-[var(--danger)] !bg-[#f4e4df]': Boolean(props.aiError),
        '!text-[#8d6b2c] !bg-[#f5eacd]': props.isAIThinking && !props.aiError,
      }"
      :role="props.aiError ? 'alert' : undefined"
      :aria-live="props.aiError ? 'assertive' : undefined"
    >
      <i class="w-[6px] h-[6px] bg-[#589066] rounded-[50%]" :class="{ 'flex-none mt-[4px] !bg-[var(--danger)]': Boolean(props.aiError), '!bg-[#c49437]': props.isAIThinking && !props.aiError }" />
      <span class="status-copy flex-1">
        {{ props.aiError || (props.isAIThinking ? 'AI 正在思考下一步' : '对弈中') }}
      </span>
      <button v-if="props.aiError" class="retry-button hover:!text-[#fff] hover:!bg-[var(--danger)]" type="button" @click="$emit('retry')">
        重试
      </button>
    </div>
  </div>
</template>

<style scoped>
.turn-card {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: var(--paper);
  border: 1px solid rgb(213 211 198 / 70%);
  border-radius: 13px;
}

.turn-stone {
  width: 29px;
  height: 29px;
  background: radial-gradient(circle at 35% 30%, #5d625b, #121411 70%);
  border-radius: 50%;
  box-shadow: 1px 2px 4px rgb(0 0 0 / 23%);
}

.mini-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: rgb(255 253 248 / 58%);
  border-radius: 10px;
}

.status-message {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 9px 10px;
  font-size: 11px;
  font-weight: 700;
  color: var(--sage-dark);
  background: var(--sage-soft);
  border-radius: 9px;
}

.retry-button {
  flex: 0 0 auto;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 750;
  color: var(--danger);
  cursor: pointer;
  background: transparent;
  border: 1px solid currentcolor;
  border-radius: 6px;
}
</style>
