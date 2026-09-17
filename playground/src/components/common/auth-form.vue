<script setup lang="ts">
import { computed, reactive } from 'vue';

/** 认证表单的输入值。 */
interface AuthFormModel {
  username: string
  password: string
}

/** 认证表单的属性。 */
interface Props {
  /** 表单所处的流程。 */
  mode: 'login' | 'register'
  /** 是否正在提交。 */
  loading?: boolean
}

/** 认证表单触发的事件。 */
interface Emits {
  /** 提交表单时触发。 */
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
  <div class="w-form p-8.5 bg-mc-paper-50/92 border border-mc-paper-0/78 rounded-5xl shadow-card">
    <div class="grid grid-cols-[repeat(2,6px)] gap-0.75 place-content-center w-8.5 h-8.5 mb-5 bg-mc-sage-600 rounded-[11px] rotate-[-8deg]" aria-hidden="true">
      <i class="block w-1.5 h-1.5 bg-mc-ivory-50 rounded-full" />
      <i class="block w-1.5 h-1.5 bg-mc-ivory-50 rounded-full" />
      <i class="block w-1.5 h-1.5 col-[1/span_2] justify-self-center bg-mc-ivory-50 rounded-full" />
    </div>
    <p class="m-0 mb-2 text-xs font-[800] text-mc-sage-600 tracking-[0.15em]">
      AI GO / QUIET FOCUS
    </p>
    <h1 class="m-0 text-5xl font-[780] text-mc-ink-950 tracking-[-0.06em]">
      {{ title }}
    </h1>
    <form class="flex flex-col gap-3.75" @submit.prevent="handleSubmit">
      <label class="flex flex-col gap-1.5 text-sm font-[750] text-mc-ink-950">
        <span>用户名</span>
        <input
          v-model="model.username"
          class="w-full min-h-10.25 px-3 text-base text-mc-ink-950 outline-none bg-mc-paper-0 border border-mc-sage-600/18 rounded-lg placeholder:text-mc-neutral-380 focus:border-mc-sage-600 focus:shadow-focus"
          type="text"
          required
          placeholder="3-64 位，字母数字下划线"
          autocomplete="username"
        >
      </label>
      <label class="flex flex-col gap-1.5 text-sm font-[750] text-mc-ink-950">
        <span>密码</span>
        <input
          v-model="model.password"
          class="w-full min-h-10.25 px-3 text-base text-mc-ink-950 outline-none bg-mc-paper-0 border border-mc-sage-600/18 rounded-lg placeholder:text-mc-neutral-380 focus:border-mc-sage-600 focus:shadow-focus"
          type="password"
          required
          placeholder="8-128 位，字母 + 数字"
          :autocomplete="isLogin ? 'current-password' : 'new-password'"
        >
      </label>
      <div class="flex gap-2 mt-1.75">
        <button
          class="inline-flex flex-1 items-center justify-between min-h-10 px-3.75 text-base font-[750] text-mc-paper-50 cursor-pointer bg-mc-sage-600 border-0 rounded-lg shadow-float hover:bg-mc-sage-680 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          :disabled="props.loading"
        >
          {{ props.loading ? '处理中...' : buttonText }} <span aria-hidden="true">→</span>
        </button>
        <button
          class="min-h-10 px-3.5 text-base font-[750] text-mc-neutral-500 cursor-pointer bg-mc-paper-125 border-0 rounded-lg hover:text-mc-ink-950"
          type="button"
          @click="handleReset"
        >
          重置
        </button>
      </div>
    </form>
  </div>
</template>
