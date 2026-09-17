<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchGoGameSetting, fetchUpdateGoGameSetting } from '@/service/api';
import { useAIStore } from '@/store/modules/ai';

defineProps<{
  /** AI 自动落子是否开启。 */
  aiEnabled: boolean
  /** AI 是否正在思考。 */
  isAIThinking: boolean
}>();

const emit = defineEmits<{
  /** 切换 AI 自动落子时触发。 */
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

/** 读取对局 AI 设置。 */
async function getSettings() {
  const { data, error } = await fetchGoGameSetting();

  if (!error && data) {
    setting.value = data;
  }
}

/** 切换对局使用的模型。 */
async function onModelChange(event: Event) {
  const modelId = Number((event.target as HTMLSelectElement).value);
  const { data, error } = await fetchUpdateGoGameSetting({ active_model_id: modelId });

  if (!error && data) {
    setting.value = data;
  }
}

onMounted(() => {
  aiStore.fetchProviders();
  getSettings();
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2 items-center justify-between">
      <div class="flex gap-2.25 items-center">
        <span class="grid place-items-center w-7.25 h-7.25 text-lg text-mc-sage-600 bg-mc-sage-100 rounded-md" aria-hidden="true">✦</span>
        <div class="flex flex-col gap-0.5">
          <strong class="text-md font-[750] text-mc-ink-950">智能对手</strong>
          <small class="text-xs text-mc-neutral-380">{{ aiEnabled ? '自动响应你的落子' : '双方手动落子' }}</small>
        </div>
      </div>
      <button
        class="inline-flex gap-1.25 items-center min-h-7.25 px-2 text-xs font-[750] cursor-pointer border rounded-sm"
        :class="aiEnabled ? '!text-mc-sage-680 !bg-mc-sage-100 !border-mc-transparent' : 'text-mc-neutral-380 bg-mc-paper-50 border-mc-sage-600/16'"
        type="button"
        :aria-pressed="aiEnabled"
        @click="emit('toggleAI')"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="aiEnabled ? 'bg-mc-sage-450' : 'bg-mc-neutral-300'" />{{ aiEnabled ? '开启' : '关闭' }}
      </button>
    </div>
    <label v-if="aiEnabled" class="flex flex-col gap-1.25 text-xs font-[650] text-mc-neutral-380">
      <span>使用模型</span>
      <select
        class="w-full min-h-8.75 px-2.25 text-sm font-[650] text-mc-ink-950 outline-none bg-mc-paper-50 border border-mc-sage-600/18 rounded-md focus:border-mc-sage-600 focus:shadow-focus"
        :value="selectedModelId"
        aria-label="选择 AI 模型"
        @change="onModelChange"
      >
        <option
          v-for="opt in modelOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
    </label>
    <p v-if="isAIThinking" class="flex gap-1.5 items-center m-0 text-xs font-[700] text-mc-ochre-550">
      <span class="w-2.25 h-2.25 border-2 border-mc-ochre-450/25 border-t-mc-ochre-600 rounded-full animate-spin" />AI 正在分析局面...
    </p>
  </div>
</template>
