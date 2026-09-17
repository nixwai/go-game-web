import { describe, expect, it } from 'vitest';
import { builtinRoutes } from '@/router/routes/builtin';
import { MAIN_NAV_ITEMS } from '../nav';

describe('main nav items', () => {
  it('points every item at an existing route', () => {
    const routeNameByPath = new Map(builtinRoutes.map(route => [route.path, route.name]));

    MAIN_NAV_ITEMS.forEach((item) => {
      expect(routeNameByPath.get(item.path)).toBe(item.name);
    });
  });
});
