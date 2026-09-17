<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';
import { MAIN_NAV_ITEMS } from '../config/nav';
import NavLink from './nav-link.vue';

const authStore = useAuthStore();
const route = useRoute();
const { routerPush, toProfile } = useRouterPush();

/** 退出登录并清除本地会话。 */
async function handleLogout() {
  await authStore.resetStore();
}
</script>

<template>
  <nav
    v-if="authStore.isLogin"
    class="flex gap-1.5 items-center"
    aria-label="主导航"
  >
    <NavLink
      v-for="item in MAIN_NAV_ITEMS"
      :key="item.name"
      :label="item.label"
      :active="route.name === item.name"
      @select="routerPush(item.path)"
    />
    <button
      class="inline-flex gap-1.75 items-center pl-3.5 ml-3 text-md text-mc-neutral-500 cursor-pointer bg-mc-transparent border-y-0 border-r-0 border-l border-mc-sage-600/18 rounded-lg transition-all hover:text-mc-sage-680"
      :class="route.name === 'profile' ? '!text-mc-sage-680' : ''"
      type="button"
      :aria-current="route.name === 'profile' ? 'page' : undefined"
      @click="toProfile"
    >
      <span class="grid place-items-center w-6.5 h-6.5 text-sm font-[750] text-mc-paper-50 bg-mc-sage-600 rounded-full">{{ authStore.userInfo.username.slice(0, 1).toUpperCase() }}</span>
      {{ authStore.userInfo.username }}
    </button>
    <button
      class="px-3.25 py-2.25 text-md font-[650] text-mc-danger-600 cursor-pointer bg-mc-transparent border-0 rounded-lg transition-all hover:bg-mc-danger-600/10 active:translate-y-px"
      type="button"
      @click="handleLogout"
    >
      退出
    </button>
  </nav>
</template>
