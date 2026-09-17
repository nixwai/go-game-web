import type { MainNavItem } from '../typings';

/** 主导航项配置。 */
export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {
    name: 'game',
    path: '/game',
    label: '对弈',
  },
  {
    name: 'settings',
    path: '/settings',
    label: 'AI 管理',
  },
];
