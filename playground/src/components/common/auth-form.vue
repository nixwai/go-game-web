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
const title = computed(() => (isLogin.value ? '登录' : '注册'));
const buttonText = computed(() => (isLogin.value ? '登录' : '注册'));

function handleSubmit() {
  emit('submit', { ...model });
}

function handleReset() {
  model.username = '';
  model.password = '';
}
</script>

<template>
  <div class="auth-form w-400px max-w-full">
    <h2 class="mb-24px text-center text-24px font-600">
      {{ title }}
    </h2>
    <form class="flex flex-col gap-16px" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-4px">
        <label for="username" class="text-14px font-500">用户名</label>
        <input
          id="username"
          v-model="model.username"
          type="text"
          class="border border-gray-3 rounded-6px px-12px py-8px outline-none focus:border-blue-5"
          placeholder="3-64位，字母数字下划线"
          autocomplete="username"
        >
      </div>
      <div class="flex flex-col gap-4px">
        <label for="password" class="text-14px font-500">密码</label>
        <input
          id="password"
          v-model="model.password"
          type="password"
          class="border border-gray-3 rounded-6px px-12px py-8px outline-none focus:border-blue-5"
          placeholder="8-128位，字母+数字"
          autocomplete="current-password"
        >
      </div>
      <div class="flex gap-12px pt-8px">
        <button
          type="submit"
          class="flex-1 rounded-6px bg-blue-5 px-16px py-10px text-white font-500 transition-colors hover:bg-blue-6 disabled:opacity-50"
          :disabled="props.loading"
        >
          {{ props.loading ? '处理中...' : buttonText }}
        </button>
        <button
          type="button"
          class="rounded-6px border border-gray-3 px-16px py-10px text-gray-600 transition-colors hover:bg-gray-1"
          @click="handleReset"
        >
          重置
        </button>
      </div>
    </form>
  </div>
</template>
