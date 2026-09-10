<script setup lang="ts">
interface Props {
  provider: Api.Ai.ProviderResponse
  deleting?: boolean
}

defineProps<Props>();

const emit = defineEmits<Emits>();

interface Emits {
  (e: 'edit'): void
  (e: 'delete'): void
}
</script>

<template>
  <div class="provider-card rounded-8px border border-gray-2 p-16px">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-8px">
        <span class="text-16px font-600">{{ provider.provider_name }}</span>
        <span
          class="rounded-4px px-4px py-2px text-10px"
          :class="provider.status === 'active' ? 'bg-green-1 text-green-6' : 'bg-gray-2 text-gray-5'"
        >
          {{ provider.status === 'active' ? '启用' : '禁用' }}
        </span>
        <span v-if="provider.is_default" class="rounded-4px bg-blue-1 px-4px py-2px text-10px text-blue-5">
          默认
        </span>
      </div>
      <div class="flex gap-8px">
        <button
          v-if="!provider.is_default"
          class="rounded-4px border border-gray-3 px-8px py-4px text-12px hover:bg-gray-1"
          @click="emit('edit')"
        >
          编辑
        </button>
        <button
          v-if="!provider.is_default"
          class="rounded-4px border border-red-3 px-8px py-4px text-12px text-red-5 hover:bg-red-1 disabled:opacity-50"
          :disabled="deleting"
          @click="emit('delete')"
        >
          {{ deleting ? '删除中...' : '删除' }}
        </button>
      </div>
    </div>
    <div class="mt-8px flex flex-col gap-4px text-12px text-gray-5">
      <span>Base URL: {{ provider.base_url }}</span>
      <span>API Key: {{ provider.has_api_key ? '已配置' : '未配置' }}</span>
    </div>
  </div>
</template>
