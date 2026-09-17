<script setup lang="ts">
import { requestState } from '@/service/request';
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-[160ms] ease-out"
    leave-active-class="transition-all duration-[160ms] ease-in"
    enter-from-class="opacity-0 translate-y-[-10px]"
    leave-to-class="opacity-0 translate-y-[-10px]"
  >
    <div
      v-if="requestState.errorMessage"
      class="fixed top-6 left-1/2 z-[1000] inline-flex gap-2.25 items-center max-w-[min(420px,calc(100vw_-_32px))] px-4 py-3 text-lg leading-[1.45] text-mc-danger-800 bg-mc-danger-50/96 border border-mc-danger-600/28 rounded-xl shadow-soft translate-x-[-50%]"
      role="alert"
      aria-live="assertive"
    >
      <span class="grid flex-none place-items-center w-5 h-5 text-md font-[800] text-mc-paper-50 bg-mc-danger-600 rounded-full" aria-hidden="true">!</span>
      <span>{{ requestState.errorMessage }}</span>
    </div>
  </Transition>
</template>
