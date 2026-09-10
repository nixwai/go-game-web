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
  <div class="min-h-screen flex items-center justify-center bg-gray-1">
    <div class="flex flex-col items-center">
      <p v-if="errorMsg" class="mb-12px text-14px text-red-5">
        {{ errorMsg }}
      </p>
      <AuthForm mode="register" :loading="loading" @submit="handleSubmit" />
      <p class="mt-16px text-14px text-gray-5">
        已有账号？
        <button class="text-blue-5 hover:underline" @click="handleToLogin">
          前往登录
        </button>
      </p>
    </div>
  </div>
</template>
