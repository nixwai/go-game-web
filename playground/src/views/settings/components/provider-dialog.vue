<script setup lang="ts">
import type { ProviderFormModel } from '../typings';
import { reactive, watch } from 'vue';

interface Props {
  visible: boolean
  mode: 'create' | 'edit'
  model: ProviderFormModel
  loading?: boolean
}

interface Emits {
  (e: 'update:visible', v: boolean): void
  (e: 'submit', data: ProviderFormModel): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localModel = reactive<ProviderFormModel>({ ...props.model });

watch(() => props.model, (val) => {
  Object.assign(localModel, val);
}, { deep: true });

function close() {
  emit('update:visible', false);
}

function handleSubmit() {
  emit('submit', { ...localModel });
}
</script>

<template>
  <div v-if="props.visible" class="provider-dialog fixed inset-0 flex items-center justify-center bg-black/40" @click.self="close">
    <div class="w-480px max-w-90vw rounded-8px bg-white p-24px">
      <h3 class="mb-16px text-18px font-600">
        {{ props.mode === 'create' ? '新增产商' : '编辑产商' }}
      </h3>
      <div class="flex flex-col gap-12px">
        <div class="flex flex-col gap-4px">
          <label class="text-14px font-500">产商名称</label>
          <input
            v-model="localModel.provider_name"
            class="border border-gray-3 rounded-6px px-12px py-8px outline-none focus:border-blue-5"
            placeholder="如 OpenAI"
          >
        </div>
        <div class="flex flex-col gap-4px">
          <label class="text-14px font-500">Base URL</label>
          <input
            v-model="localModel.base_url"
            class="border border-gray-3 rounded-6px px-12px py-8px outline-none focus:border-blue-5"
            placeholder="https://api.openai.com/v1"
          >
        </div>
        <div class="flex flex-col gap-4px">
          <label class="text-14px font-500">API Key {{ props.mode === 'edit' ? '(留空保留原密钥)' : '' }}</label>
          <input
            v-model="localModel.apiKey"
            type="password"
            class="border border-gray-3 rounded-6px px-12px py-8px outline-none focus:border-blue-5"
            placeholder="sk-..."
          >
        </div>
      </div>
      <div class="mt-16px flex justify-end gap-8px">
        <button
          class="rounded-6px border border-gray-3 px-16px py-8px text-14px hover:bg-gray-1"
          @click="close"
        >
          取消
        </button>
        <button
          class="rounded-6px bg-blue-5 px-16px py-8px text-14px text-white hover:bg-blue-6 disabled:opacity-50"
          :disabled="props.loading"
          @click="handleSubmit"
        >
          {{ props.loading ? '提交中...' : '确认' }}
        </button>
      </div>
    </div>
  </div>
</template>
