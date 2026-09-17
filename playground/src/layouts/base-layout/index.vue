<script setup lang="ts">
import { ref } from 'vue';
import RequestErrorToast from '@/components/common/request-error-toast.vue';
import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';

/** 需要保持状态的视图组件名，与视图内 defineOptions 的 name 一致。 */
const CACHED_VIEWS = ['GameView'];

const authStore = useAuthStore();
const { toGame, toSettings, toProfile, toLogin } = useRouterPush(false);
/** 变更后重建 KeepAlive，清空已缓存的对局。 */
const keepAliveKey = ref(0);

async function handleLogout() {
  await authStore.resetStore();
  keepAliveKey.value += 1;
  await toLogin();
}
</script>

<template>
  <div class="app-frame flex flex-col min-h-screen font-sans bg-gradient-to-br from-mc-canvas-100 via-mc-paper-75 to-mc-ivory-50">
    <header class="flex items-center justify-between w-full min-h-19 mx-auto">
      <button class="brand inline-flex gap-2.75 items-center p-0 ml-5 text-mc-ink-950 text-left cursor-pointer bg-mc-transparent border-0" type="button" aria-label="返回对弈" @click="toGame">
        <span class="relative grid grid-cols-[repeat(2,6px)] gap-0.75 place-content-center w-8.5 h-8.5 overflow-hidden bg-mc-sage-600 rounded-[11px] rotate-[-8deg]" aria-hidden="true">
          <i class="block w-1.5 h-1.5 bg-mc-ivory-50 rounded-full" />
          <i class="block w-1.5 h-1.5 bg-mc-ivory-50 rounded-full" />
          <i class="block w-1.5 h-1.5 col-[1/span_2] justify-self-center bg-mc-ivory-50 rounded-full" />
        </span>
        <span class="brand-copy flex flex-col gap-0.25">
          <strong class="text-3xl font-[750] tracking-[-0.03em]">AI 围棋</strong>
          <small class="text-2xs font-[750] text-mc-sage-600 tracking-[0.16em]">PLAY WITH PURPOSE</small>
        </span>
      </button>
      <nav v-if="authStore.isLogin" class="flex gap-1.5 items-center mr-5" aria-label="主导航">
        <button class="px-3.25 py-2.25 text-md font-[650] text-mc-neutral-500 cursor-pointer bg-mc-transparent border-0 rounded-lg transition-all hover:text-mc-sage-680 hover:bg-mc-paper-50/72 active:translate-y-px" :class="$route.name === 'game' ? 'text-mc-sage-680 bg-mc-paper-50/72' : ''" type="button" @click="toGame">
          对弈
        </button>
        <button class="px-3.25 py-2.25 text-md font-[650] text-mc-neutral-500 cursor-pointer bg-mc-transparent border-0 rounded-lg transition-all hover:text-mc-sage-680 hover:bg-mc-paper-50/72 active:translate-y-px" :class="$route.name === 'settings' ? 'text-mc-sage-680 bg-mc-paper-50/72' : ''" type="button" @click="toSettings">
          AI 管理
        </button>
        <button class="inline-flex gap-1.75 items-center pl-3.5 ml-3 text-md text-mc-neutral-500 cursor-pointer bg-mc-transparent border-y-0 border-r-0 border-l border-mc-sage-600/18 rounded-lg transition-all hover:text-mc-sage-680" :class="$route.name === 'profile' ? '!text-mc-sage-680' : ''" type="button" @click="toProfile">
          <span class="grid place-items-center w-6.5 h-6.5 text-sm font-[750] text-mc-paper-50 bg-mc-sage-600 rounded-full">{{ authStore.userInfo.username.slice(0, 1).toUpperCase() }}</span>
          {{ authStore.userInfo.username }}
        </button>
        <button class="px-3.25 py-2.25 text-md font-[650] text-mc-danger-600 cursor-pointer bg-mc-transparent border-0 rounded-lg transition-all hover:bg-mc-danger-600/10 active:translate-y-px" type="button" @click="handleLogout">
          退出
        </button>
      </nav>
    </header>
    <main class="flex-1 min-h-[calc(100vh-76px)]">
      <RouterView v-slot="{ Component }">
        <KeepAlive :key="keepAliveKey" :include="CACHED_VIEWS">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
    <footer class="flex gap-2 items-center justify-center pt-4.5 px-5 pb-5.5 text-base text-mc-neutral-380" aria-label="源码链接">
      <a class="text-mc-inherit no-underline transition-colors hover:text-mc-sage-680 hover:underline" href="https://github.com/nixwai/go-game-server" target="_blank" rel="noreferrer">
        服务端源码
      </a>
      <span aria-hidden="true">·</span>
      <a class="text-mc-inherit no-underline transition-colors hover:text-mc-sage-680 hover:underline" href="https://github.com/nixwai/go-game-web" target="_blank" rel="noreferrer">
        前端源码
      </a>
    </footer>
    <RequestErrorToast />
  </div>
</template>
