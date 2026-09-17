<script setup lang="ts">
import { ref } from 'vue';
import { useModelDelete } from '../hooks/use-model-delete';
import ModelDialog from './model-dialog.vue';

/** 模型列表组件的属性。 */
interface Props {
  /** 所属 AI 产商。 */
  provider: Api.Ai.ProviderResponse
  /** 重新加载产商数据。 */
  getTableData: () => Promise<void>
}

const props = defineProps<Props>();

const modelDialogRef = ref<InstanceType<typeof ModelDialog> | null>(null);
const { deletingId, handleDelete } = useModelDelete(props.getTableData);

function handleOpenCreate() {
  modelDialogRef.value?.open({ mode: 'create', providerId: props.provider.id });
}

function handleEdit(model: Api.Ai.ModelResponse) {
  modelDialogRef.value?.open({ mode: 'edit', providerId: props.provider.id, row: model });
}
</script>

<template>
  <div class="pt-4.5 mt-5 ml-10.5 border-t border-t-mc-sage-600/12">
    <div class="flex gap-3 items-center justify-between mb-2.5">
      <div class="flex flex-col gap-1">
        <strong class="text-md font-[750] text-mc-ink-950">
          模型列表
          <small class="font-[650] text-mc-neutral-380">
            ({{ provider.models.length }})
          </small>
        </strong>
      </div>
      <button
        v-if="!provider.is_default"
        class="min-h-7 px-2.25 text-xs font-[750] text-mc-sage-680 cursor-pointer bg-mc-sage-100 border-0 rounded-sm hover:!text-mc-paper-0 hover:!bg-mc-sage-600"
        type="button"
        @click="handleOpenCreate"
      >
        <span aria-hidden="true">＋</span>新增模型
      </button>
    </div>
    <div v-if="provider.models.length" class="flex flex-col gap-1.5">
      <div
        v-for="model in provider.models"
        :key="model.id"
        class="flex gap-3 items-center justify-between min-h-10 px-2.5 bg-mc-paper-50/74 rounded-md"
      >
        <div class="flex gap-1.75 items-center text-base font-[650] text-mc-ink-950">
          <span class="w-1.5 h-1.5 bg-mc-sage-600 rounded-full" aria-hidden="true" />
          <span>{{ model.model_name }}</span>
          <span
            class="inline-flex gap-1 items-center min-h-4.75 px-1.5 text-2xs font-[700] rounded-pill"
            :class="model.status !== 'active' ? 'text-mc-neutral-380 bg-mc-paper-125' : 'text-mc-sage-680 bg-mc-sage-100'"
          >
            <i
              class="w-[5px] h-[5px] rounded-full"
              :class="model.status === 'active' ? 'bg-mc-sage-450' : 'bg-mc-neutral-300'"
            />
            {{ model.status === 'active' ? '启用' : '禁用' }}
          </span>
          <span
            v-if="model.is_default"
            class="inline-flex gap-1 items-center min-h-4.75 px-1.5 text-2xs font-[700] text-mc-ochre-650 bg-mc-ochre-100 rounded-pill"
          >
            默认
          </span>
        </div>
        <div v-if="!model.is_default" class="flex gap-1.5">
          <button
            class="px-1.5 py-1 text-xs font-[700] text-mc-sage-680 cursor-pointer bg-mc-transparent border-0 rounded-xs hover:!bg-mc-sage-100"
            type="button"
            @click="handleEdit(model)"
          >
            编辑
          </button>
          <button
            class="px-1.5 py-1 text-xs font-[700] !text-mc-danger-600 cursor-pointer bg-mc-transparent border-0 rounded-xs hover:!bg-mc-danger-150 disabled:!cursor-not-allowed disabled:!opacity-[0.45]"
            type="button"
            :disabled="deletingId === model.id"
            @click="handleDelete(model.id)"
          >
            {{ deletingId === model.id ? '...' : '删除' }}
          </button>
        </div>
      </div>
    </div>
    <p v-else class="m-0 text-sm text-mc-neutral-380">
      这个产商还没有添加模型。
    </p>
    <ModelDialog ref="modelDialogRef" @success="props.getTableData" />
  </div>
</template>
