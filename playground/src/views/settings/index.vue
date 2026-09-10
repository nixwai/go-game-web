<script setup lang="ts">
import ModelList from './components/model-list.vue';
import ProviderCard from './components/provider-card.vue';
import ProviderDialog from './components/provider-dialog.vue';
import { useProviderDelete } from './hooks/use-provider-delete';
import { useProviderQuery } from './hooks/use-provider-query';
import { useProviderSubmit } from './hooks/use-provider-submit';

defineOptions({ name: 'SettingsView' });

const { loading, providers, getTableData } = useProviderQuery();
const {
  loading: submitLoading,
  dialogVisible,
  formMode,
  formModel,
  openCreate,
  openEdit,
  handleSubmit,
} = useProviderSubmit(getTableData);
const { deletingId, handleDelete } = useProviderDelete(getTableData);
</script>

<template>
  <div class="settings-view mx-auto w-800px max-w-full p-24px">
    <div class="mb-16px flex items-center justify-between">
      <h2 class="text-20px font-600">
        AI 产商管理
      </h2>
      <button
        class="rounded-6px bg-blue-5 px-16px py-8px text-14px text-white hover:bg-blue-6"
        @click="openCreate"
      >
        新增产商
      </button>
    </div>
    <div v-if="loading" class="py-24px text-center text-gray-4">
      加载中...
    </div>
    <div v-else class="flex flex-col gap-16px">
      <div v-for="provider in providers" :key="provider.id">
        <ProviderCard
          :provider="provider"
          :deleting="deletingId === provider.id"
          @edit="openEdit(provider)"
          @delete="handleDelete(provider.id)"
        />
        <ModelList :provider="provider" :get-table-data="getTableData" />
      </div>
      <p v-if="providers.length === 0" class="py-24px text-center text-gray-4">
        暂无产商配置
      </p>
    </div>
    <ProviderDialog
      v-model:visible="dialogVisible"
      :mode="formMode"
      :model="formModel"
      :loading="submitLoading"
      @submit="handleSubmit"
    />
  </div>
</template>
