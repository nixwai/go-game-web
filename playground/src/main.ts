import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import '@unocss/reset/normalize.css';
import 'virtual:uno.css';

async function setupApp() {
  const app = createApp(App);
  setupStore(app);
  await setupRouter(app);
  app.mount('#app');
}

setupApp();
