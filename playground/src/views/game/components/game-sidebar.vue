<script setup lang="ts">
</script>

<template>
  <aside class="game-sidebar p-[22px] [background:rgb(246_243_234_/_82%)] [border:1px_solid_rgb(213_211_198_/_80%)] rounded-[20px]" aria-label="对局设置">
    <div class="sidebar-header flex items-start justify-between mb-[22px]">
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
        <span class="section-line flex-1 h-[1px] bg-[rgb(65_104_78_/_13%)]" />
      </div>
      <slot name="status" />
    </section>

    <section class="control-section mt-[20px]">
      <div class="section-title">
        <span>AI 对手</span>
        <span class="section-line flex-1 h-[1px] bg-[rgb(65_104_78_/_13%)]" />
      </div>
      <slot name="ai" />
    </section>

    <section class="control-section mt-[20px]">
      <div class="section-title">
        <span>棋盘偏好</span>
        <span class="section-line flex-1 h-[1px] bg-[rgb(65_104_78_/_13%)]" />
      </div>
      <slot name="controls" />
    </section>
  </aside>
</template>

<style scoped>
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
</style>
