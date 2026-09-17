<script setup lang="ts">
import RequestErrorToast from '@/components/common/request-error-toast.vue';
import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';

const authStore = useAuthStore();
const { toGame, toSettings, toLogin } = useRouterPush(false);

async function handleLogout() {
  await authStore.resetStore();
  await toLogin();
}
</script>

<template>
  <div class="app-frame">
    <header class="app-header">
      <button class="brand" type="button" aria-label="返回对弈" @click="toGame">
        <span class="brand-mark" aria-hidden="true"><i /><i /><i class="col-[1/span_2] justify-self-center" /></span>
        <span class="brand-copy flex flex-col gap-[1px]">
          <strong class="text-[18px] font-[750] tracking-[-0.03em]">AI 围棋</strong>
          <small class="text-[9px] font-[750] text-[var(--sage)] tracking-[0.16em]">PLAY WITH PURPOSE</small>
        </span>
      </button>
      <nav v-if="authStore.isLogin" class="app-nav flex gap-[6px] items-center mr-[20px]" aria-label="主导航">
        <button class="nav-link" :class="{ active: $route.name === 'game' }" type="button" @click="toGame">
          对弈
        </button>
        <button class="nav-link" :class="{ active: $route.name === 'settings' }" type="button" @click="toSettings">
          AI 管理
        </button>
        <span class="user-chip">
          <span class="user-avatar">{{ authStore.userInfo.username.slice(0, 1).toUpperCase() }}</span>
          {{ authStore.userInfo.username }}
        </span>
        <button class="logout-button" type="button" @click="handleLogout">
          退出
        </button>
      </nav>
    </header>
    <main class="app-main flex-1 min-h-[calc(100vh-76px)]">
      <RouterView />
    </main>
    <footer class="app-footer" aria-label="源码链接">
      <a class="hover:text-[var(--sage-dark)] hover:underline" href="https://github.com/nixwai/go-game-server" target="_blank" rel="noreferrer">
        服务端源码
      </a>
      <span aria-hidden="true">·</span>
      <a class="hover:text-[var(--sage-dark)] hover:underline" href="https://github.com/nixwai/go-game-web" target="_blank" rel="noreferrer">
        前端源码
      </a>
    </footer>
    <RequestErrorToast />
  </div>
</template>

<style>
:root {
  --ink: #24261f;
  --muted: #74796c;
  --soft-muted: #9ca195;
  --paper: #fffdf8;
  --paper-deep: #f5f1e8;
  --canvas: #eef2e8;
  --sage: #41684e;
  --sage-dark: #31543e;
  --sage-soft: #dfe9dc;
  --ochre: #dcb35c;
  --ochre-dark: #a77b2f;
  --danger: #a9584d;

  font-family:
    Inter,
    ui-sans-serif,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    sans-serif;
  font-synthesis: none;
  color: var(--ink);
  text-rendering: optimizelegibility;
}

:where(*, *::before, *::after) {
  box-sizing: border-box;
}

:where(body) {
  margin: 0;
  background: var(--canvas);
}

:where(button, input, select) {
  font: inherit;
}

.app-frame {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(circle at 10% 8%, rgb(221 235 215 / 95%), transparent 30%),
    radial-gradient(circle at 92% 12%, rgb(245 235 214 / 90%), transparent 34%),
    linear-gradient(135deg, #eef3e9 0%, #f7f2e8 100%);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 76px;
  margin: 0 auto;
}

.brand {
  display: inline-flex;
  gap: 11px;
  align-items: center;
  padding: 0;
  margin-left: 20px;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.brand-mark {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 6px);
  gap: 3px;
  place-content: center center;
  width: 34px;
  height: 34px;
  overflow: hidden;
  background: var(--sage);
  border-radius: 11px;
  transform: rotate(-8deg);
}

.brand-mark i {
  display: block;
  width: 6px;
  height: 6px;
  background: #f9f4e8;
  border-radius: 50%;
}

.nav-link,
.logout-button {
  padding: 9px 13px;
  font-size: 13px;
  font-weight: 650;
  color: var(--muted);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 10px;
  transition:
    color 160ms ease,
    background 160ms ease,
    transform 160ms ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--sage-dark);
  background: rgb(255 253 248 / 72%);
}

.logout-button {
  color: var(--danger);
}

.nav-link:active,
.logout-button:active {
  transform: translateY(1px);
}

.user-chip {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding-left: 14px;
  margin-left: 12px;
  font-size: 13px;
  color: var(--muted);
  border-left: 1px solid rgb(65 104 78 / 18%);
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  font-size: 11px;
  font-weight: 750;
  color: #fffdf8;
  background: var(--sage);
  border-radius: 50%;
}

.logout-button:hover {
  background: rgb(169 88 77 / 10%);
}

.app-footer {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 18px 20px 22px;
  font-size: 12px;
  color: var(--soft-muted);
}

.app-footer a {
  color: inherit;
  text-decoration: none;
  transition: color 160ms ease;
}
</style>
