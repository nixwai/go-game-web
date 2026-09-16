<script setup lang="ts">
const coord = defineModel<boolean>('coord', { required: true });
</script>

<template>
  <div class="preference-row">
    <div>
      <span class="preference-label">显示坐标</span>
      <small>辅助定位落子位置</small>
    </div>
    <button
      class="toggle-control"
      :class="{ enabled: coord }"
      type="button"
      :aria-pressed="coord"
      @click="coord = !coord"
    >
      <span />{{ coord ? '开启' : '关闭' }}
    </button>
  </div>
</template>

<style scoped>
.preference-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.preference-row > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.preference-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

.preference-row small {
  font-size: 10px;
  color: var(--soft-muted);
}

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

.toggle-control span {
  width: 6px;
  height: 6px;
  background: #b5b9ae;
  border-radius: 50%;
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
