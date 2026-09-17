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
  <div class="model-list pt-[18px] m-[20px_0_0_42px] [border-top:1px_solid_rgb(65_104_78_/_12%)]">
    <div class="model-list-header">
      <div class="flex flex-col gap-[4px]">
        <strong class="text-[13px] font-[750] text-[var(--ink)]">模型列表 <small class="font-[650] text-[var(--soft-muted)]">({{ provider.models.length }})</small></strong>
      </div>
      <button v-if="!provider.is_default" class="hover:!text-[#fff] hover:!bg-[var(--sage)]" type="button" @click="handleOpenCreate">
        <span aria-hidden="true">＋</span>新增模型
      </button>
    </div>
    <div v-if="provider.models.length" class="models flex flex-col gap-[6px]">
      <div v-for="model in provider.models" :key="model.id" class="model-row">
        <div class="model-name">
          <span class="model-bullet w-[6px] h-[6px] bg-[var(--sage)] rounded-[50%]" aria-hidden="true" />
          <span>{{ model.model_name }}</span>
          <span class="state-tag" :class="model.status !== 'active' ? 'disabled text-[var(--soft-muted)] bg-[var(--paper-deep)]' : 'text-[var(--sage-dark)] bg-[var(--sage-soft)]'">
            <i class="w-[5px] h-[5px] rounded-[50%]" :class="model.status === 'active' ? 'bg-[#589066]' : 'bg-[#b5b9ae]'" />{{ model.status === 'active' ? '启用' : '禁用' }}
          </span>
          <span v-if="model.is_default" class="default-tag text-[#8d6b2c] bg-[#f5eacd]">默认</span>
        </div>
        <div v-if="!model.is_default" class="model-actions flex gap-[6px]">
          <button class="hover:!bg-[var(--sage-soft)]" type="button" @click="handleEdit(model)">
            编辑
          </button>
          <button
            class="delete-button !text-[var(--danger)] hover:!bg-[#f4e4df] disabled:!cursor-not-allowed disabled:!opacity-[0.45]"
            type="button"
            :disabled="deletingId === model.id"
            @click="handleDelete(model.id)"
          >
            {{ deletingId === model.id ? '...' : '删除' }}
          </button>
        </div>
      </div>
    </div>
    <p v-else class="model-empty m-0 text-[11px] text-[var(--soft-muted)]">
      这个产商还没有添加模型。
    </p>
    <ModelDialog ref="modelDialogRef" @success="props.getTableData" />
  </div>
</template>

<style scoped>
.model-list-header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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
</style>
