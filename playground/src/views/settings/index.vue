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
  <div class="px-6 pt-4.5 pb-10.5">
    <section class="w-settings-shell px-13 pt-11 pb-13 mx-auto bg-mc-paper-50/90 border border-mc-paper-0/76 rounded-6xl shadow-shell" aria-labelledby="settings-title">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">
          管理你的 AI 对手
        </h1>
        <button
          class="min-h-10 px-4 mb-3 text-base font-[750] text-mc-paper-50 cursor-pointer bg-mc-sage-600 border-0 rounded-xl shadow-float transition-all hover:!bg-mc-sage-680 hover:translate-y-[-1px]"
          type="button"
          @click="openProviderCreate"
        >
          <span aria-hidden="true">＋</span> 新增产商
        </button>
      </div>

      <div class="grid grid-cols-[repeat(3,1fr)] gap-2.5 mb-7.5" aria-label="AI 配置概览">
        <div class="flex flex-col gap-1.25 p-4 bg-mc-paper-125 text-mc-ink-950 rounded-2xl">
          <span class="text-sm font-[650] text-mc-neutral-380">已连接产商</span>
          <strong class="overflow-hidden text-ellipsis text-4xl font-[800] tracking-[-0.04em] whitespace-nowrap">{{ activeProviderCount }}</strong>
        </div>
        <div class="flex flex-col gap-1.25 p-4 bg-mc-paper-125 text-mc-ink-950 rounded-2xl">
          <span class="text-sm font-[650] text-mc-neutral-380">可用模型</span>
          <strong class="overflow-hidden text-ellipsis text-4xl font-[800] tracking-[-0.04em] whitespace-nowrap">{{ modelCount }}</strong>
        </div>
        <div class="flex flex-col gap-1.25 p-4 !bg-mc-sage-600 text-mc-paper-50 rounded-2xl">
          <span class="text-sm font-[650] text-mc-paper-50/70">当前默认</span>
          <strong class="overflow-hidden text-ellipsis text-4xl font-[800] tracking-[-0.04em] whitespace-nowrap">{{ defaultModel }}</strong>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center gap-2 min-h-45 text-base text-mc-neutral-380">
        <span class="w-2.75 h-2.75 border-2 border-mc-sage-600/18 border-t-mc-sage-600 rounded-full animate-spin" />正在读取配置...
      </div>
      <div v-else class="flex flex-col gap-5.5">
        <div
          v-for="provider in providers"
          :key="provider.id"
          class="p-5 bg-mc-paper-125/62 border border-mc-neutral-200/72 rounded-3xl"
        >
          <ProviderCard
            :provider="provider"
            :deleting="deletingId === provider.id"
            @edit="openProviderEdit(provider)"
            @delete="handleDelete(provider.id)"
          />
          <ModelList :provider="provider" :get-table-data="getTableData" />
        </div>
        <div v-if="providers.length === 0" class="flex flex-col items-center justify-center min-h-62.5 p-7.5 text-center text-base text-mc-neutral-380 bg-mc-paper-125/62 border border-dashed border-mc-sage-600/22 rounded-3xl">
          <span class="grid place-items-center w-9.5 h-9.5 mb-2.75 text-mc-sage-600 bg-mc-sage-100 rounded-xl" aria-hidden="true">✦</span>
          <strong class="text-xl text-mc-ink-950">还没有 AI 产商</strong>
          <p class="max-w-77.5 mt-2 mb-4 text-base leading-[1.6] text-mc-neutral-500">
            添加一个兼容 OpenAI API 的产商，开始你的第一盘对弈。
          </p>
        </div>
      </div>

      <ProviderDialog ref="providerDialogRef" @success="getTableData" />
    </section>
  </div>
</template>
