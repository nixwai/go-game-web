<script setup lang="ts">
import SidebarSection from './sidebar-section.vue';
</script>

<template>
  <aside class="p-5.5 bg-mc-paper-125/82 border border-mc-neutral-200/80 rounded-4xl" aria-label="对局设置">
    <div class="flex items-start justify-between mb-5.5">
      <div>
        <p class="m-0 mb-1.25 text-2xs font-[800] text-mc-sage-600 tracking-[0.16em]">
          MATCH CONTROL
        </p>
        <h2 class="m-0 text-4xl font-[780] text-mc-ink-950 tracking-[-0.04em]">
          对局控制
        </h2>
      </div>
      <span class="grid place-items-center w-7.25 h-7.25 text-xl text-mc-sage-600 bg-mc-sage-100 rounded-md" aria-hidden="true">✦</span>
    </div>

    <SidebarSection title="当前对局">
      <slot name="status" />
    </SidebarSection>

    <SidebarSection class="mt-5" title="AI 对手">
      <slot name="ai" />
    </SidebarSection>

    <SidebarSection class="mt-5" title="棋盘偏好">
      <slot name="controls" />
    </SidebarSection>
  </aside>
</template>
