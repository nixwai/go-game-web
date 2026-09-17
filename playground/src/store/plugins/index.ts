import type { PiniaPluginContext } from 'pinia';
import { SetupStoreId } from '@/enum';
import { jsonClone } from '@/utils/common';

/** 为指定 store 注入恢复初始状态的方法。 */
export function resetSetupStore(context: PiniaPluginContext) {
  const setupSyntaxIds = Object.values(SetupStoreId) as string[];

  if (setupSyntaxIds.includes(context.store.$id)) {
    const { $state } = context.store;
    const defaultStore = jsonClone($state);

    context.store.$reset = () => {
      context.store.$patch(defaultStore);
    };
  }
}
