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
  (e: 'retry'): void
  (e: 'modelChange', modelId: number): void
}

const emit = defineEmits<Emits>();
</script>

<template>
  <aside class="game-sidebar" aria-label="对局设置">
    <div class="sidebar-header">
      <div>
        <p class="panel-kicker">
          MATCH CONTROL
        </p>
        <h2>对局控制</h2>
      </div>
      <span class="control-icon" aria-hidden="true">✦</span>
    </div>

    <section class="control-section status-section">
      <div class="section-title">
        <span>当前对局</span>
        <span class="section-line" />
      </div>
      <GameStatus @retry="emit('retry')" />
    </section>

    <section class="control-section">
      <div class="section-title">
        <span>AI 对手</span>
        <span class="section-line" />
      </div>
      <ModelSelector @model-change="emit('modelChange', $event)" />
    </section>

    <section class="control-section">
      <div class="section-title">
        <span>棋盘偏好</span>
        <span class="section-line" />
      </div>
      <GameControls
        @pass="emit('pass')"
        @resign="emit('resign')"
        @new-game="emit('newGame')"
        @board-size-change="emit('boardSizeChange', $event)"
        @toggle-coord="emit('toggleCoord')"
      />
    </section>
  </aside>
</template>

<style scoped>
.game-sidebar {
  padding: 22px;
  background: rgb(246 243 234 / 82%);
  border: 1px solid rgb(213 211 198 / 80%);
  border-radius: 20px;
}

.sidebar-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
}

.panel-kicker {
  margin: 0 0 5px;
  font-size: 9px;
  font-weight: 800;
  color: var(--sage);
  letter-spacing: 0.16em;
}

h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 780;
  color: var(--ink);
  letter-spacing: -0.04em;
}

.control-icon {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  font-size: 15px;
  color: var(--sage);
  background: var(--sage-soft);
  border-radius: 9px;
}

.control-section + .control-section {
  margin-top: 20px;
}

.section-title {
  display: flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 11px;
  font-size: 10px;
  font-weight: 750;
  color: var(--soft-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.section-line {
  flex: 1;
  height: 1px;
  background: rgb(65 104 78 / 13%);
}
</style>
