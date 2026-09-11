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
  <div class="provider-card">
    <div class="provider-main">
      <div class="provider-title-row">
        <span class="provider-icon" aria-hidden="true">✦</span>
        <div>
          <div class="provider-name-row">
            <h3>{{ provider.provider_name }}</h3>
            <span class="state-tag" :class="{ disabled: provider.status !== 'active' }">
              <i />{{ provider.status === 'active' ? '启用' : '禁用' }}
            </span>
            <span v-if="provider.is_default" class="default-tag">默认</span>
          </div>
        </div>
      </div>
      <div class="provider-details">
        <span><b>BASE URL</b>{{ provider.base_url }}</span>
        <span><b>API KEY</b>{{ provider.has_api_key ? '已配置' : '未配置' }}</span>
      </div>
    </div>
    <div v-if="!provider.is_default" class="provider-actions">
      <button type="button" @click="emit('edit')">
        编辑
      </button>
      <button class="delete-button" type="button" :disabled="deleting" @click="emit('delete')">
        {{ deleting ? '删除中...' : '删除' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.provider-card {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  justify-content: space-between;
}

.provider-main {
  flex: 1;
}

.provider-title-row {
  display: flex;
  gap: 11px;
  align-items: flex-start;
}

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

.provider-name-row {
  display: flex;
  gap: 7px;
  align-items: center;
}

h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 780;
  color: var(--ink);
  letter-spacing: -0.03em;
}

.provider-title-row p {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--soft-muted);
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

.state-tag {
  color: var(--sage-dark);
  background: var(--sage-soft);
}

.state-tag i {
  width: 5px;
  height: 5px;
  background: #589066;
  border-radius: 50%;
}

.state-tag.disabled {
  color: var(--soft-muted);
  background: var(--paper-deep);
}

.state-tag.disabled i {
  background: #b5b9ae;
}

.default-tag {
  color: #8d6b2c;
  background: #f5eacd;
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

.provider-details b {
  font-size: 9px;
  font-weight: 800;
  color: var(--soft-muted);
  letter-spacing: 0.08em;
}

.provider-actions {
  display: flex;
  gap: 6px;
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

.provider-actions button:hover {
  color: #fff;
  background: var(--sage);
}

.provider-actions .delete-button {
  color: var(--danger);
  border-color: rgb(169 88 77 / 18%);
}

.provider-actions .delete-button:hover {
  color: #fff;
  background: var(--danger);
}

.provider-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
