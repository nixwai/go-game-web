<script setup lang="ts">
import AuthForm from '@/components/common/auth-form.vue';
import { useLogin } from './hooks/use-login';

defineOptions({ name: 'LoginView' });

const { loading, errorMsg, handleSubmit, toRegister } = useLogin();
</script>

<template>
  <div class="auth-page">
    <div class="auth-layout">
      <div class="auth-intro">
        <p class="intro-kicker">
          A DIFFERENT KIND OF PLAY
        </p>
        <h2>一手一世界</h2>
        <p>把每一次落子留给当下的判断</p>
        <div class="intro-line">
          <span />专注 · 平静 · 持续
        </div>
      </div>
      <div class="auth-column">
        <p v-if="errorMsg" class="error-message" role="alert">
          {{ errorMsg }}
        </p>
        <AuthForm mode="login" :loading="loading" @submit="handleSubmit" />
        <p class="auth-switch">
          还没有账号？
          <button type="button" @click="toRegister">
            前往注册
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 76px);
  padding: 40px 24px;
}

.auth-layout {
  display: grid;
  grid-template-columns: 370px 390px;
  gap: 90px;
  align-items: center;
  width: 820px;
}

.auth-intro {
  padding-bottom: 40px;
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

.intro-line span {
  width: 7px;
  height: 7px;
  background: var(--sage);
  border-radius: 50%;
}

.auth-column {
  width: 100%;
}

.error-message {
  padding: 10px 12px;
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--danger);
  background: #f4e4df;
  border-radius: 9px;
}

.auth-switch {
  margin: 14px 0 0;
  font-size: 12px;
  color: var(--muted);
  text-align: center;
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

.auth-switch button:hover {
  text-decoration: underline;
}
</style>
