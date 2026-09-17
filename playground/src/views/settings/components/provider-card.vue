<script setup lang="ts">
/** AI 产商卡片的属性。 */
interface Props {
  /** 展示的 AI 产商。 */
  provider: Api.Ai.ProviderResponse
  /** 是否正在删除。 */
  deleting?: boolean
}

defineProps<Props>();
const emit = defineEmits<Emits>();

/** AI 产商卡片触发的事件。 */
interface Emits {
  /** 请求编辑该产商。 */
  (e: 'edit'): void
  /** 请求删除该产商。 */
  (e: 'delete'): void
}
</script>

<template>
  <div class="flex gap-4.5 items-start justify-between">
    <div class="flex-1">
      <div class="flex gap-2.75 items-start">
        <span class="grid flex-none place-items-center w-7.75 h-7.75 text-lg text-mc-sage-600 bg-mc-sage-100 rounded-lg" aria-hidden="true">✦</span>
        <div>
          <div class="flex gap-1.75 items-center">
            <h3 class="m-0 text-2xl font-[780] text-mc-ink-950 tracking-[-0.03em]">
              {{ provider.provider_name }}
            </h3>
            <span class="inline-flex gap-1 items-center min-h-5 px-1.75 text-xs font-[700] rounded-pill" :class="provider.status !== 'active' ? 'text-mc-neutral-380 bg-mc-paper-125' : 'text-mc-sage-680 bg-mc-sage-100'">
              <i class="w-[5px] h-[5px] rounded-full" :class="provider.status === 'active' ? 'bg-mc-sage-450' : 'bg-mc-neutral-300'" />{{ provider.status === 'active' ? '启用' : '禁用' }}
            </span>
            <span v-if="provider.is_default" class="inline-flex gap-1 items-center min-h-5 px-1.75 text-xs font-[700] text-mc-ochre-650 bg-mc-ochre-100 rounded-pill">默认</span>
          </div>
        </div>
      </div>
      <div class="flex gap-4.5 mt-4 ml-10.5 text-sm text-mc-neutral-500">
        <span class="flex gap-1.5 items-center overflow-hidden text-ellipsis whitespace-nowrap"><b class="text-2xs font-[800] text-mc-neutral-380 tracking-[0.08em]">BASE URL</b>{{ provider.base_url }}</span>
        <span class="flex gap-1.5 items-center overflow-hidden text-ellipsis whitespace-nowrap"><b class="text-2xs font-[800] text-mc-neutral-380 tracking-[0.08em]">API KEY</b>{{ provider.has_api_key ? '已配置' : '未配置' }}</span>
      </div>
    </div>
    <div v-if="!provider.is_default" class="flex gap-1.5">
      <button class="min-h-7.25 px-2.25 text-sm font-[700] text-mc-sage-680 cursor-pointer bg-mc-paper-50 border border-mc-sage-600/16 rounded-sm hover:!text-mc-paper-0 hover:!bg-mc-sage-600" type="button" @click="emit('edit')">
        编辑
      </button>
      <button class="min-h-7.25 px-2.25 text-sm font-[700] !text-mc-danger-600 cursor-pointer bg-mc-paper-50 border border-mc-danger-600/18 rounded-sm hover:!text-mc-paper-0 hover:!bg-mc-danger-600 disabled:!cursor-not-allowed disabled:!opacity-[0.45]" type="button" :disabled="deleting" @click="emit('delete')">
        {{ deleting ? '删除中...' : '删除' }}
      </button>
    </div>
  </div>
</template>
