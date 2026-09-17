<script setup lang="ts">
const emit = defineEmits<{
  /** 开始新对局时触发。 */
  (e: 'newGame'): void
}>();
</script>

<template>
  <div class="action-grid grid grid-cols-[1fr] gap-[8px] pt-[3px]">
    <button class="action-button primary text-[#fffdf8] bg-[var(--sage)] shadow-[0_7px_14px_rgb(65_104_78_/_18%)] hover:bg-[var(--sage-dark)]" type="button" @click="emit('newGame')">
      <span aria-hidden="true">＋</span> 新局
    </button>
  </div>
</template>

<style scoped>
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
</style>
