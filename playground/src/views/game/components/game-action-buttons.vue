<script setup lang="ts">
const props = defineProps<{
  passDisabled: boolean
  resignDisabled: boolean
}>();

const emit = defineEmits<{
  (e: 'pass'): void
  (e: 'resign'): void
  (e: 'newGame'): void
}>();
</script>

<template>
  <div class="action-grid">
    <button class="action-button secondary" type="button" :disabled="props.passDisabled" @click="emit('pass')">
      停一着
    </button>
    <button
      class="action-button danger"
      type="button"
      :disabled="props.resignDisabled"
      @click="emit('resign')"
    >
      认输
    </button>
    <button class="action-button primary" type="button" @click="emit('newGame')">
      <span aria-hidden="true">＋</span> 新局
    </button>
  </div>
</template>

<style scoped>
.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.action-button:active:not(:disabled) {
  transform: translateY(1px);
}

.action-button.secondary {
  color: var(--sage-dark);
  background: var(--sage-soft);
}

.action-button.secondary:hover:not(:disabled) {
  color: #fff;
  background: var(--sage);
}

.action-button.danger {
  color: var(--danger);
  background: #f4e4df;
}

.action-button.danger:hover:not(:disabled) {
  color: #fff;
  background: var(--danger);
}

.action-button.primary {
  grid-column: 1 / -1;
  color: #fffdf8;
  background: var(--sage);
  box-shadow: 0 7px 14px rgb(65 104 78 / 18%);
}

.action-button.primary:hover {
  background: var(--sage-dark);
}
</style>
