<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchGoGameSetting, fetchUpdateGoGameSetting } from '@/service/api';
import { useAIStore } from '@/store/modules/ai';

defineProps<{
  aiEnabled: boolean
  isAIThinking: boolean
}>();

const emit = defineEmits<{
  (e: 'toggleAI'): void
}>();

const aiStore = useAIStore();
const setting = ref<Api.AiGo.GameSettingResponse | null>(null);

const selectedModelId = computed(() => setting.value?.active_model_id ?? 0);
const modelOptions = computed(() => {
  if (aiStore.activeModels.length === 0) {
    return [{ label: '默认模型', value: 0 }];
  }

  return aiStore.activeModels.map(model => ({
    label: `${model.provider_name} / ${model.model_name}`,
    value: model.id,
  }));
});

async function getSettings() {
  const { data, error } = await fetchGoGameSetting();

  if (!error && data) {
    setting.value = data;
  }
}

onMounted(getSettings);

async function onModelChange(event: Event) {
  const modelId = Number((event.target as HTMLSelectElement).value);
  const { error } = await fetchUpdateGoGameSetting({ active_model_id: modelId });

  if (!error) {
    await getSettings();
  }
}
</script>

<template>
  <div class="model-selector">
    <div class="ai-row">
      <div class="ai-identity">
        <span class="ai-avatar" aria-hidden="true">✦</span>
        <div>
          <strong>智能对手</strong>
          <small>{{ aiEnabled ? '自动响应你的落子' : '双方手动落子' }}</small>
        </div>
      </div>
      <button
        class="ai-toggle"
        :class="{ enabled: aiEnabled }"
        type="button"
        :aria-pressed="aiEnabled"
        @click="emit('toggleAI')"
      >
        <span />{{ aiEnabled ? '开启' : '关闭' }}
      </button>
    </div>
    <label v-if="aiEnabled" class="model-field">
      <span>使用模型</span>
      <select :value="selectedModelId" aria-label="选择 AI 模型" @change="onModelChange">
        <option v-for="opt in modelOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>
    <p v-if="isAIThinking" class="thinking-label">
      <span class="thinking-spinner" />AI 正在分析局面...
    </p>
  </div>
</template>

<style scoped>
.model-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.ai-identity {
  display: flex;
  gap: 9px;
  align-items: center;
}

.ai-avatar {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  font-size: 14px;
  color: var(--sage);
  background: var(--sage-soft);
  border-radius: 9px;
}

.ai-identity > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ai-identity strong {
  font-size: 13px;
  font-weight: 750;
  color: var(--ink);
}

.ai-identity small {
  font-size: 10px;
  color: var(--soft-muted);
}

.ai-toggle {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  min-height: 29px;
  padding: 0 8px;
  font-size: 10px;
  font-weight: 750;
  color: var(--soft-muted);
  cursor: pointer;
  background: var(--paper);
  border: 1px solid rgb(65 104 78 / 16%);
  border-radius: 8px;
}

.ai-toggle span {
  width: 6px;
  height: 6px;
  background: #b5b9ae;
  border-radius: 50%;
}

.ai-toggle.enabled {
  color: var(--sage-dark);
  background: var(--sage-soft);
  border-color: transparent;
}

.ai-toggle.enabled span {
  background: #589066;
}

.model-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 10px;
  font-weight: 650;
  color: var(--soft-muted);
}

.model-field select {
  width: 100%;
  min-height: 35px;
  padding: 0 9px;
  font-size: 11px;
  font-weight: 650;
  color: var(--ink);
  outline: none;
  background: var(--paper);
  border: 1px solid rgb(65 104 78 / 18%);
  border-radius: 9px;
}

.model-field select:focus {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgb(65 104 78 / 10%);
}

.thinking-label {
  display: flex;
  gap: 6px;
  align-items: center;
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  color: #9a742c;
}

.thinking-spinner {
  width: 9px;
  height: 9px;
  border: 2px solid rgb(196 148 55 / 25%);
  border-top-color: #c49437;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
