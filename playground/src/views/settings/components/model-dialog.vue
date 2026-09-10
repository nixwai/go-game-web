<script setup lang="ts">
import type { ModelFormModel } from '../typings';
import { reactive, watch } from 'vue';

interface Props {
  visible: boolean
  mode: 'create' | 'edit'
  model: ModelFormModel
  loading?: boolean
}

interface Emits {
  (e: 'update:visible', v: boolean): void
  (e: 'submit', data: ModelFormModel): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localModel = reactive<ModelFormModel>({ ...props.model });

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
  <div v-if="props.visible" class="model-dialog fixed inset-0 flex items-center justify-center bg-black/40" @click.self="close">
    <div class="w-400px max-w-90vw rounded-8px bg-white p-24px">
      <h3 class="mb-16px text-18px font-600">
        {{ props.mode === 'create' ? '新增模型' : '编辑模型' }}
      </h3>
      <div class="flex flex-col gap-4px">
        <label class="text-14px font-500">模型名称</label>
        <input
          v-model="localModel.model_name"
          class="border border-gray-3 rounded-6px px-12px py-8px outline-none focus:border-blue-5"
          placeholder="如 gpt-4o"
        >
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
