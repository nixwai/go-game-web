<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { STORAGE_PREFIX } from '@/constants/app';

/** 明暗主题状态，默认浅色并持久化到本地。 */
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  storageKey: `${STORAGE_PREFIX}theme`,
  initialValue: 'light',
});
const toggleDark = useToggle(isDark);
</script>

<template>
  <button
    class="inline-flex items-center justify-center w-9 h-9 text-mc-neutral-500 cursor-pointer bg-mc-transparent border-0 rounded-lg transition-all hover:text-mc-sage-680 hover:bg-mc-paper-50/72 active:translate-y-px"
    type="button"
    :aria-pressed="isDark"
    :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
    @click="toggleDark()"
  >
    <svg
      v-if="isDark"
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
    <svg
      v-else
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  </button>
</template>
