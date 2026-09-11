<script setup lang="ts">
import { useModelDelete } from '../hooks/use-model-delete';
import { useModelSubmit } from '../hooks/use-model-submit';
import ModelDialog from './model-dialog.vue';

interface Props {
  provider: Api.Ai.ProviderResponse
  getTableData: () => Promise<void>
}

const props = defineProps<Props>();

const {
  loading: submitLoading,
  dialogVisible,
  formMode,
  formModel,
  openCreate,
  openEdit,
  handleSubmit,
} = useModelSubmit(props.getTableData);
const { deletingId, handleDelete } = useModelDelete(props.getTableData);

function handleOpenCreate() {
  openCreate(props.provider.id);
}

function handleEdit(model: Api.Ai.ModelResponse) {
  openEdit(props.provider.id, model);
}
</script>

<template>
  <div class="model-list">
    <div class="model-list-header">
      <div>
        <strong>模型列表 <small>({{ provider.models.length }})</small></strong>
      </div>
      <button v-if="!provider.is_default" type="button" @click="handleOpenCreate">
        <span aria-hidden="true">＋</span>新增模型
      </button>
    </div>
    <div v-if="provider.models.length" class="models">
      <div v-for="model in provider.models" :key="model.id" class="model-row">
        <div class="model-name">
          <span class="model-bullet" aria-hidden="true" />
          <span>{{ model.model_name }}</span>
          <span class="state-tag" :class="{ disabled: model.status !== 'active' }">
            <i />{{ model.status === 'active' ? '启用' : '禁用' }}
          </span>
          <span v-if="model.is_default" class="default-tag">默认</span>
        </div>
        <div v-if="!model.is_default" class="model-actions">
          <button type="button" @click="handleEdit(model)">
            编辑
          </button>
          <button
            class="delete-button"
            type="button"
            :disabled="deletingId === model.id"
            @click="handleDelete(model.id)"
          >
            {{ deletingId === model.id ? '...' : '删除' }}
          </button>
        </div>
      </div>
    </div>
    <p v-else class="model-empty">
      这个产商还没有添加模型。
    </p>
    <ModelDialog
      v-model:visible="dialogVisible"
      :mode="formMode"
      :model="formModel"
      :loading="submitLoading"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.model-list {
  padding-top: 18px;
  margin: 20px 0 0 42px;
  border-top: 1px solid rgb(65 104 78 / 12%);
}

.model-list-header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.model-list-header > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-list-header strong {
  font-size: 13px;
  font-weight: 750;
  color: var(--ink);
}

.model-list-header strong small {
  font-weight: 650;
  color: var(--soft-muted);
}

.model-list-header button {
  min-height: 28px;
  padding: 0 9px;
  font-size: 10px;
  font-weight: 750;
  color: var(--sage-dark);
  cursor: pointer;
  background: var(--sage-soft);
  border: 0;
  border-radius: 8px;
}

.model-actions button {
  padding: 4px 6px;
  font-size: 10px;
  font-weight: 700;
  color: var(--sage-dark);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
}

.model-actions button:hover {
  background: var(--sage-soft);
}

.model-list-header button:hover {
  color: #fff;
  background: var(--sage);
}

.models {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.model-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 10px;
  background: rgb(255 253 248 / 74%);
  border-radius: 9px;
}

.model-name {
  display: flex;
  gap: 7px;
  align-items: center;
  font-size: 12px;
  font-weight: 650;
  color: var(--ink);
}

.model-bullet {
  width: 6px;
  height: 6px;
  background: var(--sage);
  border-radius: 50%;
}

.state-tag,
.default-tag {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  min-height: 19px;
  padding: 0 6px;
  font-size: 9px;
  font-weight: 700;
  border-radius: 99px;
}

.state-tag {
  color: var(--sage-dark);
  background: var(--sage-soft);
}

.state-tag i {
  width: 5px;
  height: 5px;
  background: #589066;
  border-radius: 50%;
}

.state-tag.disabled {
  color: var(--soft-muted);
  background: var(--paper-deep);
}

.state-tag.disabled i {
  background: #b5b9ae;
}

.default-tag {
  color: #8d6b2c;
  background: #f5eacd;
}

.model-actions {
  display: flex;
  gap: 6px;
}

.model-actions .delete-button {
  color: var(--danger);
}

.model-actions .delete-button:hover {
  background: #f4e4df;
}

.model-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.model-empty {
  margin: 0;
  font-size: 11px;
  color: var(--soft-muted);
}
</style>
