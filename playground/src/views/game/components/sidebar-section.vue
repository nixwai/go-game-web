<script setup lang="ts">
defineProps<{
  /** 分组标题。 */
  title: string
}>();
</script>

<template>
  <section>
    <div class="flex gap-2.25 items-center mb-2.75 text-xs font-[750] text-mc-neutral-380 uppercase tracking-[0.1em]">
      <span>{{ title }}</span>
      <span class="flex-1 h-px bg-mc-sage-600/13" />
    </div>
    <slot />
  </section>
</template>
