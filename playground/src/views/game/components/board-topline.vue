<template>
  <div class="board-topline">
    <div class="player-pair">
      <span class="player-badge inline-flex gap-[6px] items-center"><i class="stone-dot black inline-block w-[11px] h-[11px] rounded-[50%] bg-[#1c1d1a] shadow-[1px_1px_2px_rgb(0_0_0_/_24%)]" />你 · 黑方</span>
      <span class="versus text-[10px] font-[800] text-[var(--soft-muted)] tracking-[0.08em]">VS</span>
      <span class="player-badge inline-flex gap-[6px] items-center"><i class="stone-dot white inline-block w-[11px] h-[11px] rounded-[50%] bg-[#fff] [border:1px_solid_#c8c8c0] shadow-[1px_1px_2px_rgb(0_0_0_/_12%)]" />AI · 白方</span>
    </div>
    <span class="status-pill">
      <i />对弈进行中
    </span>
  </div>
</template>

<style scoped>
.board-topline {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  width: 620px;
  margin: 0 auto 13px;
}

.player-pair {
  display: flex;
  gap: 11px;
  align-items: center;
  font-size: 12px;
  font-weight: 650;
  color: var(--muted);
}

.status-pill {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 750;
  color: var(--sage-dark);
  background: var(--sage-soft);
  border-radius: 99px;
}

.status-pill i {
  width: 6px;
  height: 6px;
  background: #5c9b6c;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgb(92 155 108 / 14%);
}
</style>
