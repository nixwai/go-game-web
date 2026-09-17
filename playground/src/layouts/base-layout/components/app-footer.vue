<script setup lang="ts">
import { FOOTER_LINKS } from '../config/footer';
</script>

<template>
  <footer
    class="flex gap-2 items-center justify-center pt-4.5 px-5 pb-5.5 text-base text-mc-neutral-380"
    aria-label="源码链接"
  >
    <template v-for="(link, index) in FOOTER_LINKS" :key="link.href">
      <span v-if="index > 0" aria-hidden="true">·</span>
      <a
        class="text-mc-inherit no-underline transition-colors hover:text-mc-sage-680 hover:underline"
        :href="link.href"
        target="_blank"
        rel="noreferrer"
      >
        {{ link.label }}
      </a>
    </template>
  </footer>
</template>
