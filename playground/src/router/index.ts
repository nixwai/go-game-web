import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createRouterGuard } from './guard';
import { routes } from './routes';

/** 应用路由实例。 */
export const router = createRouter({
  history: createWebHistory(),
  routes,
});

/** 将路由注册到应用并等待首次导航完成。 */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
