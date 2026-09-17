import type { RouteLocationRaw } from 'vue-router';
import { useRouter } from 'vue-router';
import { router as globalRouter } from '@/router';

/** 提供常用路由跳转方法。 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter;
  const route = globalRouter.currentRoute;

  function routerPush(location: RouteLocationRaw) {
    return router.push(location);
  }

  function routerBack() {
    return router.back();
  }

  async function toLogin(redirectUrl?: string) {
    const redirect = redirectUrl ?? route.value.fullPath;
    const query = redirect !== '/' && redirect !== '/login' ? { redirect } : {};

    return routerPush({ path: '/login', query });
  }

  async function toRegister() {
    return routerPush({ path: '/register' });
  }

  async function toGame() {
    return routerPush({ path: '/game' });
  }

  async function toSettings() {
    return routerPush({ path: '/settings' });
  }

  async function toProfile() {
    return routerPush({ path: '/profile' });
  }

  async function redirectFromLogin(needRedirect = true) {
    const redirect = route.value.query?.redirect as string;

    if (needRedirect && redirect) {
      await routerPush(redirect);
    }
    else {
      await toGame();
    }
  }

  return {
    routerPush,
    routerBack,
    toLogin,
    toRegister,
    toGame,
    toSettings,
    toProfile,
    redirectFromLogin,
  };
}
