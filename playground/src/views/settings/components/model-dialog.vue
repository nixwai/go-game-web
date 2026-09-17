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
  <div v-if="dialogVisible" class="dialog-backdrop" @click.self="close">
    <div class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="model-dialog-title">
      <div class="dialog-header flex gap-[16px] items-start justify-between">
        <div>
          <p class="dialog-kicker">
            MODEL CATALOG
          </p>
          <h3 id="model-dialog-title">
            {{ formMode === 'create' ? '新增模型' : '编辑模型' }}
          </h3>
        </div>
        <button class="close-button hover:!text-[var(--ink)]" type="button" aria-label="关闭" @click="close">
          ×
        </button>
      </div>
      <p class="dialog-note m-[10px_0_20px] text-[12px] leading-[1.6] text-[var(--muted)]">
        输入服务商公开的模型标识，保存后即可在对弈页切换。
      </p>
      <form class="dialog-form flex flex-col gap-[14px]" @submit.prevent="handleSubmit">
        <label class="field">
          <span>模型名称</span>
          <input v-model="formModel.model_name" class="focus:!border-[var(--sage)] focus:!shadow-[0_0_0_3px_rgb(65_104_78_/_10%)]" required placeholder="例如 gpt-4o" autocomplete="off">
        </label>
        <div class="dialog-actions flex gap-[8px] justify-end mt-[6px]">
          <button class="cancel-button text-[var(--muted)] bg-[var(--paper-deep)]" type="button" @click="close">
            取消
          </button>
          <button class="confirm-button text-[#fff] bg-[var(--sage)] hover:!bg-[var(--sage-dark)] disabled:!cursor-not-allowed disabled:!opacity-50" type="submit" :disabled="loading">
            {{ loading ? '保存中...' : '保存模型' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(36 38 31 / 32%);
  backdrop-filter: blur(5px);
}

.dialog-card {
  width: 400px;
  padding: 25px;
  background: var(--paper);
  border: 1px solid rgb(255 255 255 / 82%);
  border-radius: 18px;
  box-shadow: 0 24px 60px rgb(36 38 31 / 20%);
}

.dialog-kicker {
  margin: 0 0 6px;
  font-size: 9px;
  font-weight: 800;
  color: var(--sage);
  letter-spacing: 0.14em;
}

h3 {
  margin: 0;
  font-size: 21px;
  font-weight: 780;
  color: var(--ink);
  letter-spacing: -0.04em;
}

.close-button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  font-size: 21px;
  line-height: 1;
  color: var(--soft-muted);
  cursor: pointer;
  background: var(--paper-deep);
  border: 0;
  border-radius: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
  font-weight: 750;
  color: var(--ink);
}

.field input {
  width: 100%;
  min-height: 38px;
  padding: 0 11px;
  font-size: 12px;
  color: var(--ink);
  outline: none;
  background: #fff;
  border: 1px solid rgb(65 104 78 / 18%);
  border-radius: 9px;
}

.cancel-button,
.confirm-button {
  min-height: 36px;
  padding: 0 14px;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
  border: 0;
  border-radius: 9px;
}
</style>
