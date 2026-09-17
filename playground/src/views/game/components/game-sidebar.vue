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

    <section>
      <div class="flex gap-2.25 items-center mb-2.75 text-xs font-[750] text-mc-neutral-380 uppercase tracking-[0.1em]">
        <span>当前对局</span>
        <span class="flex-1 h-px bg-mc-sage-600/13" />
      </div>
      <slot name="status" />
    </section>

    <section class="mt-5">
      <div class="flex gap-2.25 items-center mb-2.75 text-xs font-[750] text-mc-neutral-380 uppercase tracking-[0.1em]">
        <span>AI 对手</span>
        <span class="flex-1 h-px bg-mc-sage-600/13" />
      </div>
      <slot name="ai" />
    </section>

    <section class="mt-5">
      <div class="flex gap-2.25 items-center mb-2.75 text-xs font-[750] text-mc-neutral-380 uppercase tracking-[0.1em]">
        <span>棋盘偏好</span>
        <span class="flex-1 h-px bg-mc-sage-600/13" />
      </div>
      <slot name="controls" />
    </section>
  </aside>
</template>
