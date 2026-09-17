<script setup lang="ts">
import { computed } from 'vue';
import RequestErrorToast from '@/components/common/request-error-toast.vue';
import { useAuthStore } from '@/store/modules/auth';
import AppBrand from './components/app-brand.vue';
import AppFooter from './components/app-footer.vue';
import MainNav from './components/main-nav.vue';
import ThemeToggle from './components/theme-toggle.vue';

/** 需要保持状态的视图组件名，与视图内 defineOptions 的 name 一致。 */
const CACHED_VIEWS = ['GameView'];

const authStore = useAuthStore();
/** 会话标识作为缓存键，登录状态变化时重建 KeepAlive，避免复用上一个账号的对局。 */
const viewCacheKey = computed(() => authStore.token);
</script>

<template>
  <div class="dark:mc-lr flex flex-col min-h-screen font-sans bg-gradient-to-br from-mc-canvas-100 via-mc-paper-75 to-mc-ivory-50">
    <header class="flex items-center justify-between w-full min-h-19 mx-auto">
      <AppBrand />
      <div class="flex items-center gap-1.5 mr-5">
        <ThemeToggle />
        <MainNav />
      </div>
    </header>
    <main class="flex-1 min-h-[calc(100vh-76px)]">
      <RouterView v-slot="{ Component }">
        <KeepAlive :key="viewCacheKey" :include="CACHED_VIEWS">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
    <AppFooter />
    <RequestErrorToast />
  </div>
</template>
