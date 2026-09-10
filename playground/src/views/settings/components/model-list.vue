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

const {
  deletingId,
  handleDelete,
} = useModelDelete(props.getTableData);

function handleOpenCreate() {
  openCreate(props.provider.id);
}

function handleEdit(model: Api.Ai.ModelResponse) {
  openEdit(props.provider.id, model);
}
</script>

<template>
  <div class="model-list flex flex-col gap-8px pl-16px">
    <div class="flex items-center justify-between">
      <span class="text-14px font-500 text-gray-6">模型列表 ({{ provider.models.length }})</span>
      <button
        class="rounded-4px bg-blue-5 px-8px py-4px text-12px text-white hover:bg-blue-6"
        @click="handleOpenCreate"
      >
        新增模型
      </button>
    </div>
    <div
      v-for="model in provider.models"
      :key="model.id"
      class="flex items-center justify-between rounded-4px bg-gray-1 px-12px py-6px"
    >
      <div class="flex items-center gap-8px">
        <span class="text-14px">{{ model.model_name }}</span>
        <span
          class="rounded-4px px-4px py-1px text-10px"
          :class="model.status === 'active' ? 'bg-green-1 text-green-6' : 'bg-gray-2 text-gray-5'"
        >
          {{ model.status === 'active' ? '启用' : '禁用' }}
        </span>
        <span v-if="model.is_default" class="rounded-4px bg-blue-1 px-4px py-1px text-10px text-blue-5">
          默认
        </span>
      </div>
      <div v-if="!model.is_default" class="flex gap-4px">
        <button
          class="rounded-4px border border-gray-3 px-6px py-2px text-12px hover:bg-gray-2"
          @click="handleEdit(model)"
        >
          编辑
        </button>
        <button
          class="rounded-4px border border-red-3 px-6px py-2px text-12px text-red-5 hover:bg-red-1 disabled:opacity-50"
          :disabled="deletingId === model.id"
          @click="handleDelete(model.id)"
        >
          {{ deletingId === model.id ? '...' : '删除' }}
        </button>
      </div>
    </div>
    <p v-if="provider.models.length === 0" class="text-12px text-gray-4">
      暂无模型
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
