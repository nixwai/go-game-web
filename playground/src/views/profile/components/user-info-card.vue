<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { formatDate } from '@/utils/format';
import { USER_ROLE_TEXT, USER_STATUS_TEXT } from '../config/user-info';

const authStore = useAuthStore();
const { userInfo: user } = storeToRefs(authStore);

const userInitial = computed(() => user.value.username.slice(0, 1).toUpperCase());
const roleText = computed(() => USER_ROLE_TEXT[user.value.role]);
const statusText = computed(() => USER_STATUS_TEXT[user.value.status]);
const createdTime = computed(() => user.value.created_at ? formatDate(user.value.created_at) : '—');
</script>

<template>
  <section class="user-card p-5.5 bg-mc-paper-125/62 border border-mc-neutral-200/72 rounded-3xl" aria-label="账号信息">
    <div class="user-summary flex gap-4 items-center pb-5 border-b border-mc-sage-600/13">
      <span class="grid place-items-center w-14 h-14 text-3xl font-[800] text-mc-paper-50 bg-mc-sage-600 rounded-3xl" aria-hidden="true">
        {{ userInitial }}
      </span>
      <div class="min-w-0">
        <p class="m-0 mb-1 text-2xs font-[800] text-mc-sage-600 tracking-[0.14em]">
          USER PROFILE
        </p>
        <h2 class="overflow-hidden m-0 text-4xl font-[780] text-ellipsis text-mc-ink-950 tracking-[-0.04em] whitespace-nowrap">
          {{ user.username }}
        </h2>
        <span class="inline-flex mt-2 px-2.5 py-1 text-xs font-[750] text-mc-sage-680 bg-mc-sage-100 rounded-pill">
          {{ roleText }}
        </span>
      </div>
    </div>

    <dl class="user-detail grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 mt-5">
      <div class="detail-item p-3.5 bg-mc-paper-50 rounded-xl">
        <dt class="mb-1 text-xs font-[650] text-mc-neutral-380">
          用户 ID
        </dt>
        <dd class="m-0 text-lg font-[780] text-mc-ink-950">
          {{ user.id }}
        </dd>
      </div>
      <div class="detail-item p-3.5 bg-mc-paper-50 rounded-xl">
        <dt class="mb-1 text-xs font-[650] text-mc-neutral-380">
          账号状态
        </dt>
        <dd class="m-0 text-lg font-[780] text-mc-ink-950">
          {{ statusText }}
        </dd>
      </div>
      <div class="detail-item col-span-2 p-3.5 bg-mc-paper-50 rounded-xl">
        <dt class="mb-1 text-xs font-[650] text-mc-neutral-380">
          注册时间
        </dt>
        <dd class="m-0 text-lg font-[780] text-mc-ink-950">
          {{ createdTime }}
        </dd>
      </div>
    </dl>
  </section>
</template>
