import type { App } from 'vue';
import { createPinia } from 'pinia';
import { resetSetupStore } from './plugins';

/** 将状态管理注册到应用。 */
export function setupStore(app: App) {
  const store = createPinia();
  store.use(resetSetupStore);
  app.use(store);
}
