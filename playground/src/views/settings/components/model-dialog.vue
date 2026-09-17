<script setup lang="ts">
import { useModelSubmit } from '../hooks/use-model-submit';

/** 模型弹窗触发的事件。 */
interface Emits {
  /** 保存成功后触发。 */
  (e: 'success'): void
}

defineOptions({ name: 'ModelDialog' });

const emit = defineEmits<Emits>();
const {
  loading,
  dialogVisible,
  formMode,
  formModel,
  open,
  close,
  handleSubmit: submitForm,
} = useModelSubmit();

async function handleSubmit() {
  const success = await submitForm();

  if (success) {
    close();
    emit('success');
  }
}

defineExpose({ open });
</script>

<template>
  <div
    v-if="dialogVisible"
    class="fixed inset-0 z-20 grid place-items-center p-5 bg-mc-ink-950/32 backdrop-blur-[5px]"
    @click.self="close"
  >
    <div
      class="w-dialog-sm p-6.25 bg-mc-paper-50 border border-mc-paper-0/82 rounded-3xl shadow-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="model-dialog-title"
    >
      <div class="flex gap-4 items-start justify-between">
        <div>
          <p class="m-0 mb-1.5 text-2xs font-[800] text-mc-sage-600 tracking-[0.14em]">
            MODEL CATALOG
          </p>
          <h3 id="model-dialog-title" class="m-0 text-4xl font-[780] text-mc-ink-950 tracking-[-0.04em]">
            {{ formMode === 'create' ? '新增模型' : '编辑模型' }}
          </h3>
        </div>
        <button
          class="grid place-items-center w-7 h-7 text-4xl leading-none text-mc-neutral-380 cursor-pointer bg-mc-paper-125 border-0 rounded-sm hover:!text-mc-ink-950"
          type="button"
          aria-label="关闭"
          @click="close"
        >
          ×
        </button>
      </div>
      <p class="m-[10px_0_20px] text-base leading-[1.6] text-mc-neutral-500">
        输入服务商公开的模型标识，保存后即可在对弈页切换。
      </p>
      <form class="flex flex-col gap-3.5" @submit.prevent="handleSubmit">
        <label class="flex flex-col gap-1.5 text-sm font-[750] text-mc-ink-950">
          <span>模型名称</span>
          <input
            v-model="formModel.model_name"
            class="w-full min-h-9.5 px-2.75 text-base text-mc-ink-950 outline-none bg-mc-paper-0 border border-mc-sage-600/18 rounded-md focus:border-mc-sage-600 focus:shadow-focus"
            required
            placeholder="例如 gpt-4o"
            autocomplete="off"
          >
        </label>
        <div class="flex gap-2 justify-end mt-1.5">
          <button
            class="min-h-9 px-3.5 text-sm font-[750] cursor-pointer border-0 rounded-md text-mc-neutral-500 bg-mc-paper-125"
            type="button"
            @click="close"
          >
            取消
          </button>
          <button
            class="min-h-9 px-3.5 text-sm font-[750] cursor-pointer border-0 rounded-md text-mc-paper-50 bg-mc-sage-600 hover:!bg-mc-sage-680 disabled:!cursor-not-allowed disabled:!opacity-50"
            type="submit"
            :disabled="loading"
          >
            {{ loading ? '保存中...' : '保存模型' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
