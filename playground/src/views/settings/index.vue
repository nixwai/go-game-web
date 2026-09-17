<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';
import ModelList from './components/model-list.vue';
import ProviderCard from './components/provider-card.vue';
import ProviderDialog from './components/provider-dialog.vue';
import { useProviderDelete } from './hooks/use-provider-delete';
import { useProviderQuery } from './hooks/use-provider-query';

defineOptions({ name: 'SettingsView' });

const aiStore = useAIStore();
const { loading, providers, getTableData } = useProviderQuery();
const providerDialogRef = ref<InstanceType<typeof ProviderDialog> | null>(null);
const { deletingId, handleDelete } = useProviderDelete(getTableData);

const activeProviderCount = computed(() => providers.value.filter(provider => provider.status === 'active').length);
const modelCount = computed(() => providers.value.reduce((total, provider) => total + provider.models.length, 0));
const defaultModel = computed(() => aiStore.defaultModel?.model_name || '未设置');

function openProviderCreate() {
  providerDialogRef.value?.open();
}

function openProviderEdit(provider: Api.Ai.ProviderResponse) {
  providerDialogRef.value?.open({ mode: 'edit', row: provider });
}
</script>

<template>
  <div class="settings-view p-[18px_24px_42px]">
    <section class="settings-shell" aria-labelledby="settings-title">
      <div class="flex justify-between align-center">
        <h1 class="text-2xl font-bold">
          管理你的 AI 对手
        </h1>
        <button class="primary-button hover:!bg-[var(--sage-dark)] hover:translate-y-[-1px]" type="button" @click="openProviderCreate">
          <span aria-hidden="true">＋</span> 新增产商
        </button>
      </div>

      <div class="settings-overview grid grid-cols-[repeat(3,1fr)] gap-[10px] mb-[30px]" aria-label="AI 配置概览">
        <div class="overview-card">
          <span class="text-[var(--overview-label)] text-[11px] font-[650]">已连接产商</span>
          <strong>{{ activeProviderCount }}</strong>
        </div>
        <div class="overview-card">
          <span class="text-[var(--overview-label)] text-[11px] font-[650]">可用模型</span>
          <strong>{{ modelCount }}</strong>
        </div>
        <div class="overview-card accent !bg-[var(--sage)] ![--overview-label:rgb(255_253_248_/_70%)] ![--overview-value:#fffdf8] text-[#fffdf8]">
          <span class="text-[var(--overview-label)] text-[11px] font-[650]">当前默认</span>
          <strong>{{ defaultModel }}</strong>
        </div>
      </div>

      <div v-if="loading" class="loading-state gap-[8px] min-h-[180px]">
        <span class="loading-spinner" />正在读取配置...
      </div>
      <div v-else class="provider-list flex flex-col gap-[22px]">
        <div v-for="provider in providers" :key="provider.id" class="provider-group p-[20px] [background:rgb(246_243_234_/_62%)] [border:1px_solid_rgb(213_211_198_/_72%)] rounded-[18px]">
          <ProviderCard
            :provider="provider"
            :deleting="deletingId === provider.id"
            @edit="openProviderEdit(provider)"
            @delete="handleDelete(provider.id)"
          />
          <ModelList :provider="provider" :get-table-data="getTableData" />
        </div>
        <div v-if="providers.length === 0" class="empty-state">
          <span class="empty-icon" aria-hidden="true">✦</span>
          <strong class="empty-title text-[15px] text-[var(--ink)]">还没有 AI 产商</strong>
          <p>添加一个兼容 OpenAI API 的产商，开始你的第一盘对弈。</p>
        </div>
      </div>

      <ProviderDialog ref="providerDialogRef" @success="getTableData" />
    </section>
  </div>
</template>

<style scoped>
.settings-shell {
  width: 1040px;
  padding: 44px 52px 52px;
  margin: 0 auto;
  background: rgb(255 253 248 / 90%);
  border: 1px solid rgb(255 255 255 / 76%);
  border-radius: 28px;
  box-shadow:
    0 26px 70px rgb(92 91 69 / 14%),
    0 2px 8px rgb(92 91 69 / 4%);
}

.primary-button {
  min-height: 40px;
  padding: 0 16px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 750;
  color: #fffdf8;
  cursor: pointer;
  background: var(--sage);
  border: 0;
  border-radius: 11px;
  box-shadow: 0 7px 14px rgb(65 104 78 / 18%);
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.overview-card {
  --overview-label: var(--soft-muted);
  --overview-value: var(--ink);

  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 16px;
  background: var(--paper-deep);
  border-radius: 14px;
}

.overview-card strong {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 21px;
  font-weight: 800;
  color: var(--overview-value);
  letter-spacing: -0.04em;
  white-space: nowrap;
}

.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--soft-muted);
}

.loading-spinner {
  width: 11px;
  height: 11px;
  border: 2px solid rgb(65 104 78 / 18%);
  border-top-color: var(--sage);
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.empty-state {
  flex-direction: column;
  min-height: 250px;
  padding: 30px;
  text-align: center;
  background: rgb(246 243 234 / 62%);
  border: 1px dashed rgb(65 104 78 / 22%);
  border-radius: 18px;
}

.empty-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-bottom: 11px;
  color: var(--sage);
  background: var(--sage-soft);
  border-radius: 12px;
}

.empty-state p {
  max-width: 310px;
  margin: 8px 0 16px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
