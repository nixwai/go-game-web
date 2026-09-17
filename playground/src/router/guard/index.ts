import type { Router } from 'vue-router';

import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';

/** 注册认证与标题守卫。 */
export function createRouterGuard(router: Router) {
  createAuthGuard(router);
  createTitleGuard(router);
}

function createAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    const token = localStg.token.value;
    const authStore = useAuthStore();

    // 已登录访问登录/注册页 → 跳转游戏页
    if (token && (to.name === 'login' || to.name === 'register')) {
      return { path: '/game' };
    }

    // 常量路由（无需认证）直接放行
    if (to.meta.constant) {
      return true;
    }

    // 需要认证但未登录 → 跳转登录页
    if (to.meta.requiresAuth && !token) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      };
    }

    // 首次进入受保护路由，初始化用户信息
    if (to.meta.requiresAuth && token && !authStore.isLogin) {
      authStore.token = token;
      await authStore.getUserInfo();
    }

    return true;
  });
}

function createTitleGuard(router: Router) {
  router.afterEach((to) => {
    const title = to.meta.title;

    if (title) {
      document.title = `${title} - AI围棋对弈`;
    }
  });
}
