<script setup lang="ts">
import { computed, reactive } from 'vue';

interface AuthFormModel {
  username: string
  password: string
}

interface Props {
  mode: 'login' | 'register'
  loading?: boolean
}

interface Emits {
  (e: 'submit', model: AuthFormModel): void
}

const props = withDefaults(defineProps<Props>(), { loading: false });
const emit = defineEmits<Emits>();
const model = reactive<AuthFormModel>({ username: '', password: '' });
const isLogin = computed(() => props.mode === 'login');
const title = computed(() => isLogin.value ? '欢迎回来' : '创建你的账号');
const buttonText = computed(() => isLogin.value ? '进入棋局' : '开始使用');

function handleSubmit() {
  emit('submit', { ...model });
}

function handleReset() {
  model.username = '';
  model.password = '';
}
</script>

<template>
  <div class="auth-form">
    <div class="auth-brand-mark" aria-hidden="true">
      <i /><i /><i />
    </div>
    <p class="auth-eyebrow">
      AI GO / QUIET FOCUS
    </p>
    <h1>{{ title }}</h1>
    <form class="auth-fields" @submit.prevent="handleSubmit">
      <label class="auth-field">
        <span>用户名</span>
        <input
          v-model="model.username"
          type="text"
          required
          placeholder="3-64 位，字母数字下划线"
          autocomplete="username"
        >
      </label>
      <label class="auth-field">
        <span>密码</span>
        <input
          v-model="model.password"
          type="password"
          required
          placeholder="8-128 位，字母 + 数字"
          :autocomplete="isLogin ? 'current-password' : 'new-password'"
        >
      </label>
      <div class="auth-actions">
        <button class="submit-button" type="submit" :disabled="props.loading">
          {{ props.loading ? '处理中...' : buttonText }} <span aria-hidden="true">→</span>
        </button>
        <button class="reset-button" type="button" @click="handleReset">
          重置
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-form {
  width: 390px;
  padding: 34px;
  background: rgb(255 253 248 / 92%);
  border: 1px solid rgb(255 255 255 / 78%);
  border-radius: 22px;
  box-shadow: 0 22px 55px rgb(92 91 69 / 13%);
}

.auth-brand-mark {
  display: grid;
  grid-template-columns: repeat(2, 6px);
  gap: 3px;
  place-content: center center;
  width: 34px;
  height: 34px;
  margin-bottom: 20px;
  background: var(--sage);
  border-radius: 11px;
  transform: rotate(-8deg);
}

.auth-brand-mark i {
  display: block;
  width: 6px;
  height: 6px;
  background: #f9f4e8;
  border-radius: 50%;
}

.auth-brand-mark i:last-child {
  grid-column: 1 / span 2;
  justify-self: center;
}

.auth-eyebrow {
  margin: 0 0 8px;
  font-size: 10px;
  font-weight: 800;
  color: var(--sage);
  letter-spacing: 0.15em;
}

h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 780;
  color: var(--ink);
  letter-spacing: -0.06em;
}

.auth-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
  font-weight: 750;
  color: var(--ink);
}

.auth-field input {
  width: 100%;
  min-height: 41px;
  padding: 0 12px;
  font-size: 12px;
  color: var(--ink);
  outline: none;
  background: #fff;
  border: 1px solid rgb(65 104 78 / 18%);
  border-radius: 10px;
}

.auth-field input::placeholder {
  color: #b0b4aa;
}

.auth-field input:focus {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgb(65 104 78 / 10%);
}

.auth-actions {
  display: flex;
  gap: 8px;
  margin-top: 7px;
}

.submit-button,
.reset-button {
  min-height: 40px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  border: 0;
  border-radius: 10px;
}

.submit-button {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  color: #fffdf8;
  background: var(--sage);
  box-shadow: 0 7px 14px rgb(65 104 78 / 18%);
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.submit-button:hover:not(:disabled) {
  background: var(--sage-dark);
}

.reset-button {
  color: var(--muted);
  background: var(--paper-deep);
}

.reset-button:hover {
  color: var(--ink);
}
</style>
