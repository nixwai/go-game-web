<script setup lang="ts">
const emit = defineEmits<{
  /** 开始新对局时触发。 */
  (e: 'newGame'): void
}>();
</script>

<template>
  <div class="grid grid-cols-[1fr] gap-2 pt-0.75">
    <button
      class="min-h-9.5 px-2.25 text-base font-[750] text-mc-paper-50 cursor-pointer bg-mc-sage-600 border-0 rounded-xl shadow-float transition-all hover:bg-mc-sage-680 active:translate-y-px"
      type="button"
      @click="emit('newGame')"
    >
      <span aria-hidden="true">＋</span> 新局
    </button>
  </div>
</template>
