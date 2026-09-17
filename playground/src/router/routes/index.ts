import type { RouteRecordRaw } from 'vue-router';
import { builtinRoutes } from './builtin';

/** 应用全部路由。 */
export const routes: RouteRecordRaw[] = [...builtinRoutes];
