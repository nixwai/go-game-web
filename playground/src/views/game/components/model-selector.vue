<script setup lang="ts">
import { computed } from 'vue';
import { useAIStore } from '@/store/modules/ai';
import { useGameStore } from '@/store/modules/game';

const emit = defineEmits<Emits>();
const gameStore = useGameStore();
const aiStore = useAIStore();

const selectedModelId = computed(() => gameStore.setting?.active_model_id ?? 0);

const modelOptions = computed(() => {
  if (aiStore.activeModels.length === 0) {
    return [{ label: '默认模型', value: 0 }];
  }

  return aiStore.activeModels.map(m => ({
    label: `${m.provider_name} / ${m.model_name}${m.is_default ? ' (默认)' : ''}`,
    value: m.id,
  }));
});

function toggleAI() {
  gameStore.aiEnabled = !gameStore.aiEnabled;
}

interface Emits {
  (e: 'modelChange', modelId: number): void
}

function onModelChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const modelId = Number(target.value);

  emit('modelChange', modelId);
}
</script>

<template>
  <div class="model-selector flex flex-col gap-8px">
    <div class="flex items-center justify-between">
      <span class="text-14px font-500">AI 对手</span>
      <button
        class="rounded-4px px-8px py-4px text-12px transition-colors"
        :class="gameStore.aiEnabled ? 'bg-green-5 text-white' : 'bg-gray-3 text-gray-6'"
        @click="toggleAI"
      >
        {{ gameStore.aiEnabled ? '已开启' : '已关闭' }}
      </button>
    </div>
    <select
      v-if="gameStore.aiEnabled"
      class="border border-gray-3 rounded-4px px-8px py-6px text-14px outline-none focus:border-blue-5"
      :value="selectedModelId"
      @change="onModelChange"
    >
      <option v-for="opt in modelOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="gameStore.isAIThinking" class="text-12px text-blue-5">
      AI 思考中...
    </p>
  </div>
</template>
