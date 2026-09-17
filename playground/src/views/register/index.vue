<script setup lang="ts">
import AuthForm from '@/components/common/auth-form.vue';
import { useRegister } from './hooks/use-register';

defineOptions({ name: 'RegisterView' });

const { loading, errorMsg, handleSubmit, toLogin } = useRegister();

function handleToLogin() {
  void toLogin();
}
</script>

<template>
  <div class="auth-page grid place-items-center min-h-[calc(100vh-76px)] p-[40px_24px]">
    <div class="auth-layout">
      <div class="auth-intro pb-[40px]">
        <p class="intro-kicker">
          BEGIN YOUR JOURNEY
        </p>
        <h2>从第一手开始</h2>
        <p>保留每一次尝试，也保留每一次进步。</p>
        <div class="intro-line">
          <span class="w-[7px] h-[7px] bg-[var(--sage)] rounded-[50%]" />专注 · 平静 · 持续
        </div>
      </div>
      <div class="auth-column w-full">
        <p v-if="errorMsg" class="error-message" role="alert">
          {{ errorMsg }}
        </p>
        <div v-else class="h-48px" />
        <AuthForm mode="register" :loading="loading" @submit="handleSubmit" />
        <p class="auth-switch mt-[14px] text-[12px] text-[var(--muted)] text-center">
          已有账号？
          <button class="hover:underline" type="button" @click="handleToLogin">
            前往登录
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: 370px 390px;
  gap: 90px;
  align-items: center;
  width: 820px;
}

.intro-kicker {
  margin: 0 0 15px;
  font-size: 10px;
  font-weight: 800;
  color: var(--sage);
  letter-spacing: 0.15em;
}

.auth-intro h2 {
  margin: 0;
  font-size: 66px;
  font-weight: 780;
  line-height: 1;
  color: var(--ink);
  letter-spacing: -0.08em;
}

.auth-intro > p:not(.intro-kicker) {
  max-width: 250px;
  margin: 20px 0 25px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--muted);
}

.intro-line {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--soft-muted);
}

.error-message {
  padding: 10px 12px;
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--danger);
  background: #f4e4df;
  border-radius: 9px;
}

.auth-switch button {
  padding: 0;
  font-size: inherit;
  font-weight: 750;
  color: var(--sage-dark);
  cursor: pointer;
  background: transparent;
  border: 0;
}
</style>
