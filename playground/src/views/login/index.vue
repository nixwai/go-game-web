<script setup lang="ts">
import AuthForm from '@/components/common/auth-form.vue';
import { useLogin } from './hooks/use-login';

defineOptions({ name: 'LoginView' });

const { loading, errorMsg, handleSubmit, toRegister } = useLogin();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-1">
    <div class="flex flex-col items-center">
      <p v-if="errorMsg" class="mb-12px text-14px text-red-5">
        {{ errorMsg }}
      </p>
      <AuthForm mode="login" :loading="loading" @submit="handleSubmit" />
      <p class="mt-16px text-14px text-gray-5">
        还没有账号？
        <button class="text-blue-5 hover:underline" @click="toRegister">
          前往注册
        </button>
      </p>
    </div>
  </div>
</template>
