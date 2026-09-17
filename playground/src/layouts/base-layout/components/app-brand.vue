<script setup lang="ts">
import { useRouterPush } from '@/hooks/common/router';

const { toGame } = useRouterPush();
</script>

<template>
  <button
    class="inline-flex gap-2.75 items-center p-0 ml-5 text-mc-ink-950 text-left cursor-pointer bg-mc-transparent border-0"
    type="button"
    aria-label="返回对弈"
    @click="toGame"
  >
    <span
      class="relative grid grid-cols-[repeat(2,6px)] gap-0.75 place-content-center w-8.5 h-8.5 overflow-hidden bg-mc-sage-600 rounded-[11px] rotate-[-8deg]"
      aria-hidden="true"
    >
      <i class="block w-1.5 h-1.5 bg-mc-ivory-50 rounded-full" />
      <i class="block w-1.5 h-1.5 bg-mc-ivory-50 rounded-full" />
      <i class="block w-1.5 h-1.5 col-[1/span_2] justify-self-center bg-mc-ivory-50 rounded-full" />
    </span>
    <span class="flex flex-col gap-0.25">
      <strong class="text-3xl font-[750] tracking-[-0.03em]">AI 围棋</strong>
      <small class="text-2xs font-[750] text-mc-sage-600 tracking-[0.16em]">PLAY WITH PURPOSE</small>
    </span>
  </button>
</template>
