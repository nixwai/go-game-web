<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  gameStatus: 'playing' | 'ended'
}>();

const statusLabel = computed(() => props.gameStatus === 'ended' ? '对局已结束' : '对弈进行中');
</script>

<template>
  <div class="board-topline">
    <div class="player-pair">
      <span class="player-badge"><i class="stone-dot black" />你 · 黑方</span>
      <span class="versus">VS</span>
      <span class="player-badge"><i class="stone-dot white" />AI · 白方</span>
    </div>
    <span class="status-pill" :class="{ ended: props.gameStatus === 'ended' }">
      <i />{{ statusLabel }}
    </span>
  </div>
</template>

<style scoped>
.board-topline {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  width: 620px;
  margin: 0 auto 13px;
}

.player-pair {
  display: flex;
  gap: 11px;
  align-items: center;
  font-size: 12px;
  font-weight: 650;
  color: var(--muted);
}

.player-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.versus {
  font-size: 10px;
  font-weight: 800;
  color: var(--soft-muted);
  letter-spacing: 0.08em;
}

.stone-dot {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.stone-dot.black {
  background: #1c1d1a;
  box-shadow: 1px 1px 2px rgb(0 0 0 / 24%);
}

.stone-dot.white {
  background: #fff;
  border: 1px solid #c8c8c0;
  box-shadow: 1px 1px 2px rgb(0 0 0 / 12%);
}

.status-pill {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 750;
  color: var(--sage-dark);
  background: var(--sage-soft);
  border-radius: 99px;
}

.status-pill i {
  width: 6px;
  height: 6px;
  background: #5c9b6c;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgb(92 155 108 / 14%);
}

.status-pill.ended {
  color: var(--danger);
  background: #f4e4df;
}

.status-pill.ended i {
  background: var(--danger);
  box-shadow: 0 0 0 3px rgb(169 88 77 / 12%);
}
</style>
