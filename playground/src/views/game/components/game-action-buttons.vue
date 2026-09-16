<script setup lang="ts">
const emit = defineEmits<{
  (e: 'newGame'): void
}>();
</script>

<template>
  <div class="action-grid">
    <button class="action-button primary" type="button" @click="emit('newGame')">
      <span aria-hidden="true">＋</span> 新局
    </button>
  </div>
</template>

<style scoped>
.action-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding-top: 3px;
}

.action-button {
  min-height: 38px;
  padding: 0 9px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  border: 0;
  border-radius: 11px;
  transition:
    color 160ms ease,
    background 160ms ease,
    opacity 160ms ease,
    transform 160ms ease;
}

.action-button:active {
  transform: translateY(1px);
}

.action-button.primary {
  color: #fffdf8;
  background: var(--sage);
  box-shadow: 0 7px 14px rgb(65 104 78 / 18%);
}

.action-button.primary:hover {
  background: var(--sage-dark);
}
</style>
