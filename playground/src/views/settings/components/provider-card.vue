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
  <div class="provider-card flex gap-[18px] items-start justify-between">
    <div class="provider-main flex-1">
      <div class="provider-title-row flex gap-[11px] items-start">
        <span class="provider-icon" aria-hidden="true">✦</span>
        <div>
          <div class="provider-name-row flex gap-[7px] items-center">
            <h3>{{ provider.provider_name }}</h3>
            <span class="state-tag" :class="provider.status !== 'active' ? 'disabled text-[var(--soft-muted)] bg-[var(--paper-deep)]' : 'text-[var(--sage-dark)] bg-[var(--sage-soft)]'">
              <i class="w-[5px] h-[5px] rounded-[50%]" :class="provider.status === 'active' ? 'bg-[#589066]' : 'bg-[#b5b9ae]'" />{{ provider.status === 'active' ? '启用' : '禁用' }}
            </span>
            <span v-if="provider.is_default" class="default-tag text-[#8d6b2c] bg-[#f5eacd]">默认</span>
          </div>
        </div>
      </div>
      <div class="provider-details">
        <span><b class="text-[9px] font-[800] text-[var(--soft-muted)] tracking-[0.08em]">BASE URL</b>{{ provider.base_url }}</span>
        <span><b class="text-[9px] font-[800] text-[var(--soft-muted)] tracking-[0.08em]">API KEY</b>{{ provider.has_api_key ? '已配置' : '未配置' }}</span>
      </div>
    </div>
    <div v-if="!provider.is_default" class="provider-actions flex gap-[6px]">
      <button class="hover:!text-[#fff] hover:!bg-[var(--sage)]" type="button" @click="emit('edit')">
        编辑
      </button>
      <button class="delete-button !text-[var(--danger)] !border-[rgb(169_88_77_/_18%)] hover:!text-[#fff] hover:!bg-[var(--danger)] disabled:!cursor-not-allowed disabled:!opacity-[0.45]" type="button" :disabled="deleting" @click="emit('delete')">
        {{ deleting ? '删除中...' : '删除' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.provider-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 31px;
  height: 31px;
  font-size: 14px;
  color: var(--sage);
  background: var(--sage-soft);
  border-radius: 10px;
}

h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 780;
  color: var(--ink);
  letter-spacing: -0.03em;
}

.state-tag,
.default-tag {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  min-height: 20px;
  padding: 0 7px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 99px;
}

.provider-details {
  display: flex;
  gap: 18px;
  margin: 16px 0 0 42px;
  font-size: 11px;
  color: var(--muted);
}

.provider-details span {
  display: flex;
  gap: 6px;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.provider-actions button {
  min-height: 29px;
  padding: 0 9px;
  font-size: 11px;
  font-weight: 700;
  color: var(--sage-dark);
  cursor: pointer;
  background: var(--paper);
  border: 1px solid rgb(65 104 78 / 16%);
  border-radius: 8px;
}
</style>
