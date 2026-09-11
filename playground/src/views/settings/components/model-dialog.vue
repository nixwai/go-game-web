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

watch(() => props.model, (value) => {
  Object.assign(localModel, value);
}, { deep: true });

function close() {
  emit('update:visible', false);
}

function handleSubmit() {
  emit('submit', { ...localModel });
}
</script>

<template>
  <div v-if="props.visible" class="dialog-backdrop" @click.self="close">
    <div class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="model-dialog-title">
      <div class="dialog-header">
        <div>
          <p class="dialog-kicker">
            MODEL CATALOG
          </p>
          <h3 id="model-dialog-title">
            {{ props.mode === 'create' ? '新增模型' : '编辑模型' }}
          </h3>
        </div>
        <button class="close-button" type="button" aria-label="关闭" @click="close">
          ×
        </button>
      </div>
      <p class="dialog-note">
        输入服务商公开的模型标识，保存后即可在对弈页切换。
      </p>
      <form class="dialog-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>模型名称</span>
          <input v-model="localModel.model_name" required placeholder="例如 gpt-4o" autocomplete="off">
        </label>
        <div class="dialog-actions">
          <button class="cancel-button" type="button" @click="close">
            取消
          </button>
          <button class="confirm-button" type="submit" :disabled="props.loading">
            {{ props.loading ? '保存中...' : '保存模型' }}
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

.dialog-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
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

.close-button:hover {
  color: var(--ink);
}

.dialog-note {
  margin: 10px 0 20px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
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

.field input:focus {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgb(65 104 78 / 10%);
}

.dialog-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 6px;
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

.cancel-button {
  color: var(--muted);
  background: var(--paper-deep);
}

.confirm-button {
  color: #fff;
  background: var(--sage);
}

.confirm-button:hover {
  background: var(--sage-dark);
}

.confirm-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
