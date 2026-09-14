<script setup lang="ts">
import { requestState } from '@/service/request';
</script>

<template>
  <Transition name="request-error">
    <div
      v-if="requestState.errorMessage"
      class="request-error-toast"
      role="alert"
      aria-live="assertive"
    >
      <span class="request-error-icon" aria-hidden="true">!</span>
      <span>{{ requestState.errorMessage }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.request-error-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  z-index: 1000;
  display: inline-flex;
  gap: 9px;
  align-items: center;
  max-width: min(420px, calc(100vw - 32px));
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.45;
  color: #7f2f29;
  background: rgb(255 246 241 / 96%);
  border: 1px solid rgb(169 88 77 / 28%);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgb(66 48 31 / 15%);
  transform: translateX(-50%);
}

.request-error-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 20px;
  height: 20px;
  font-size: 13px;
  font-weight: 800;
  color: #fffdf8;
  background: var(--danger, #a9584d);
  border-radius: 50%;
}

.request-error-enter-active,
.request-error-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.request-error-enter-from,
.request-error-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
