<script setup lang="ts">
import type { PasswordChangeFormModel } from '../typings';
import { reactive } from 'vue';
import { usePasswordChange } from '../hooks/use-password-change';

const { loading, errorMsg, successMsg, handleSubmit } = usePasswordChange();

const model = reactive<PasswordChangeFormModel>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

/** 清空已填写的密码。 */
function resetForm() {
  model.oldPassword = '';
  model.newPassword = '';
  model.confirmPassword = '';
}

async function onSubmit() {
  const success = await handleSubmit({ ...model });

  if (success) {
    resetForm();
  }
}
</script>

<template>
  <section class="p-5.5 bg-mc-paper-125/62 border border-mc-neutral-200/72 rounded-3xl" aria-labelledby="password-title">
    <div class="mb-5">
      <p class="m-0 mb-1 text-2xs font-[800] text-mc-sage-600 tracking-[0.14em]">
        PASSWORD UPDATE
      </p>
      <h2 id="password-title" class="m-0 text-4xl font-[780] text-mc-ink-950 tracking-[-0.04em]">
        修改密码
      </h2>
    </div>

    <form class="flex flex-col gap-3.5" @submit.prevent="onSubmit">
      <label class="flex flex-col gap-1.5 text-sm font-[750] text-mc-ink-950">
        <span>原密码</span>
        <input
          v-model="model.oldPassword"
          class="w-full min-h-9.5 px-2.75 text-base text-mc-ink-950 outline-none bg-mc-paper-0 border border-mc-sage-600/18 rounded-md placeholder:text-mc-neutral-380 focus:border-mc-sage-600 focus:shadow-focus"
          type="password"
          required
          placeholder="请输入当前密码"
          autocomplete="current-password"
        >
      </label>
      <label class="flex flex-col gap-1.5 text-sm font-[750] text-mc-ink-950">
        <span>新密码</span>
        <input
          v-model="model.newPassword"
          class="w-full min-h-9.5 px-2.75 text-base text-mc-ink-950 outline-none bg-mc-paper-0 border border-mc-sage-600/18 rounded-md placeholder:text-mc-neutral-380 focus:border-mc-sage-600 focus:shadow-focus"
          type="password"
          required
          placeholder="8-128 位，字母 + 数字"
          autocomplete="new-password"
        >
      </label>
      <label class="flex flex-col gap-1.5 text-sm font-[750] text-mc-ink-950">
        <span>确认新密码</span>
        <input
          v-model="model.confirmPassword"
          class="w-full min-h-9.5 px-2.75 text-base text-mc-ink-950 outline-none bg-mc-paper-0 border border-mc-sage-600/18 rounded-md placeholder:text-mc-neutral-380 focus:border-mc-sage-600 focus:shadow-focus"
          type="password"
          required
          placeholder="请再次输入新密码"
          autocomplete="new-password"
        >
      </label>

      <p
        v-if="errorMsg"
        class="px-3 py-2.5 m-0 text-base text-mc-danger-600 bg-mc-danger-150 rounded-md"
        role="alert"
      >
        {{ errorMsg }}
      </p>
      <p
        v-else-if="successMsg"
        class="px-3 py-2.5 m-0 text-base text-mc-sage-680 bg-mc-sage-100 rounded-md"
        role="status"
      >
        {{ successMsg }}
      </p>

      <button
        class="min-h-10 px-4 mt-1.5 text-base font-[750] text-mc-paper-50 cursor-pointer bg-mc-sage-600 border-0 rounded-xl shadow-float transition-all hover:!bg-mc-sage-680 hover:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-50"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? '保存中...' : '更新密码' }}
      </button>
    </form>
  </section>
</template>
