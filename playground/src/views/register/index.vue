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
  <div class="grid place-items-center min-h-[calc(100vh-76px)] px-6 py-10">
    <div class="grid grid-cols-[370px_390px] gap-[90px] items-center w-layout">
      <div class="pb-10">
        <p class="m-0 mb-3.75 text-xs font-[800] text-mc-sage-600 tracking-[0.15em]">
          BEGIN YOUR JOURNEY
        </p>
        <h2 class="m-0 text-6xl font-[780] leading-none text-mc-ink-950 tracking-[-0.08em]">
          从第一手开始
        </h2>
        <p class="max-w-62.5 mt-5 mb-6.25 text-lg leading-[1.8] text-mc-neutral-500">
          保留每一次尝试，也保留每一次进步。
        </p>
        <div class="inline-flex gap-2 items-center text-sm font-[700] text-mc-neutral-380">
          <span class="w-1.75 h-1.75 bg-mc-sage-600 rounded-full" />专注 · 平静 · 持续
        </div>
      </div>
      <div class="w-full">
        <p
          v-if="errorMsg"
          class="px-3 py-2.5 mb-2.5 text-base text-mc-danger-600 bg-mc-danger-150 rounded-md"
          role="alert"
        >
          {{ errorMsg }}
        </p>
        <div v-else class="h-12" />
        <AuthForm
          mode="register"
          :loading="loading"
          @submit="handleSubmit"
        />
        <p class="mt-3.5 text-base text-mc-neutral-500 text-center">
          已有账号？
          <button
            class="p-0 text-mc-inherit font-[750] text-mc-sage-680 cursor-pointer bg-mc-transparent border-0 hover:underline"
            type="button"
            @click="handleToLogin"
          >
            前往登录
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
