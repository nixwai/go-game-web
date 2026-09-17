<script setup lang="ts">
/** 是否显示棋盘坐标。 */
const coord = defineModel<boolean>('coord', { required: true });
</script>

<template>
  <div class="preference-row flex gap-3 items-center justify-between">
    <div class="flex flex-col gap-0.75">
      <span class="preference-label text-md font-[700] text-mc-ink-950">显示坐标</span>
      <small class="text-xs text-mc-neutral-380">辅助定位落子位置</small>
    </div>
    <button
      class="inline-flex gap-1.5 items-center min-h-8 px-2.25 text-base font-[700] cursor-pointer outline-none border rounded-md"
      :class="coord ? 'text-mc-sage-680 bg-mc-sage-100 border-mc-transparent' : 'text-mc-neutral-380 bg-mc-paper-50 border-mc-sage-600/18'"
      type="button"
      :aria-pressed="coord"
      @click="coord = !coord"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="coord ? 'bg-mc-sage-450' : 'bg-mc-neutral-300'" />{{ coord ? '开启' : '关闭' }}
    </button>
  </div>
</template>
