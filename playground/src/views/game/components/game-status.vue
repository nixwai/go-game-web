<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/store/modules/game';
import { formatPlayer } from '@/utils/format';

const gameStore = useGameStore();

const playerText = computed(() => formatPlayer(gameStore.currentPlayer));
const statusText = computed(() => gameStore.gameStatus === 'ended' ? '对局结束' : '对弈中');
const playerIsBlack = computed(() => gameStore.currentPlayer === 1);
</script>

<template>
  <div class="game-status">
    <div class="turn-card">
      <div class="turn-stone" :class="{ white: !playerIsBlack }" aria-hidden="true" />
      <div class="turn-copy">
        <span>当前执棋</span>
        <strong>{{ playerText }}</strong>
      </div>
      <span class="turn-arrow" aria-hidden="true">↗</span>
    </div>
    <div class="status-grid">
      <div class="mini-stat">
        <span>手数</span>
        <strong>{{ gameStore.moveCount }}</strong>
      </div>
      <div class="mini-stat">
        <span>停一着</span>
        <strong>{{ gameStore.passCount }} / 2</strong>
      </div>
    </div>
    <div class="status-message" :class="{ ended: gameStore.gameStatus === 'ended', thinking: gameStore.isAIThinking }">
      <i />
      {{ gameStore.isAIThinking ? 'AI 正在思考下一步' : statusText }}
    </div>
  </div>
</template>

<style scoped>
.game-status {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

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

.turn-stone.white {
  background: radial-gradient(circle at 35% 30%, #fff, #d8d8d0 70%);
  border: 1px solid #c2c4bc;
}

.turn-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.turn-copy span,
.mini-stat span {
  font-size: 10px;
  font-weight: 650;
  color: var(--soft-muted);
}

.turn-copy strong {
  font-size: 14px;
  font-weight: 780;
  color: var(--ink);
}

.turn-arrow {
  font-size: 17px;
  font-weight: 700;
  color: var(--sage);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 9px;
}

.mini-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: rgb(255 253 248 / 58%);
  border-radius: 10px;
}

.mini-stat strong {
  font-size: 14px;
  font-weight: 780;
  color: var(--ink);
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

.status-message i {
  width: 6px;
  height: 6px;
  background: #589066;
  border-radius: 50%;
}

.status-message.thinking {
  color: #8d6b2c;
  background: #f5eacd;
}

.status-message.thinking i {
  background: #c49437;
}

.status-message.ended {
  color: var(--danger);
  background: #f4e4df;
}

.status-message.ended i {
  background: var(--danger);
}
</style>
