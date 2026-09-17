<script setup lang="ts">
/** 是否显示棋盘坐标。 */
const coord = defineModel<boolean>('coord', { required: true });
</script>

<template>
  <div class="preference-row flex gap-[12px] items-center justify-between">
    <div class="flex flex-col gap-[3px]">
      <span class="preference-label text-[13px] font-[700] text-[var(--ink)]">显示坐标</span>
      <small class="text-[10px] text-[var(--soft-muted)]">辅助定位落子位置</small>
    </div>
    <button
      class="toggle-control"
      :class="{ enabled: coord }"
      type="button"
      :aria-pressed="coord"
      @click="coord = !coord"
    >
      <span class="w-[6px] h-[6px] bg-[#b5b9ae] rounded-[50%]" />{{ coord ? '开启' : '关闭' }}
    </button>
  </div>
</template>

<style scoped>
.toggle-control {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  min-height: 32px;
  padding: 0 9px;
  font-size: 12px;
  font-weight: 700;
  color: var(--soft-muted);
  cursor: pointer;
  outline: none;
  background: var(--paper);
  border: 1px solid rgb(65 104 78 / 18%);
  border-radius: 9px;
}

.toggle-control.enabled {
  color: var(--sage-dark);
  background: var(--sage-soft);
  border-color: transparent;
}

.toggle-control.enabled span {
  background: #589066;
}
</style>
