<script setup lang="ts">
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
  <div class="min-h-screen flex flex-col">
    <header class="flex items-center justify-between border-b border-gray-2 px-24px py-12px">
      <div class="flex items-center gap-12px">
        <span class="text-20px font-700 text-gray-8">AI围棋对弈</span>
      </div>
      <nav class="flex items-center gap-16px">
        <button
          class="rounded-4px px-12px py-6px text-14px text-gray-6 transition-colors hover:bg-gray-1 hover:text-gray-8"
          @click="toGame"
        >
          对弈
        </button>
        <button
          class="rounded-4px px-12px py-6px text-14px text-gray-6 transition-colors hover:bg-gray-1 hover:text-gray-8"
          @click="toSettings"
        >
          AI管理
        </button>
        <span v-if="authStore.isLogin" class="text-14px text-gray-5">{{ authStore.userInfo.username }}</span>
        <button
          v-if="authStore.isLogin"
          class="rounded-4px px-12px py-6px text-14px text-red-5 transition-colors hover:bg-red-1"
          @click="handleLogout"
        >
          退出
        </button>
      </nav>
    </header>
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
