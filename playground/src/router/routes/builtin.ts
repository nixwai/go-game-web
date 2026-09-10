import type { RouteRecordRaw } from 'vue-router';

export const builtinRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', constant: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
    meta: { title: '注册', constant: true },
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/views/game/index.vue'),
    meta: { title: 'AI围棋对弈', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/index.vue'),
    meta: { title: 'AI模型管理', requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/game',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '页面不存在', constant: true },
  },
];
