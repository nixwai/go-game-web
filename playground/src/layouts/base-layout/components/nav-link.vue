<script setup lang="ts">
const props = defineProps<{
  /** 导航文案。 */
  label: string
  /** 是否为当前路由。 */
  active: boolean
}>();

const emit = defineEmits<{
  /** 点击导航项时触发。 */
  (e: 'select'): void
}>();
</script>

<template>
  <button
    class="px-3.25 py-2.25 text-md font-[650] text-mc-neutral-500 cursor-pointer bg-mc-transparent border-0 rounded-lg transition-all hover:text-mc-sage-680 hover:bg-mc-paper-50/72 active:translate-y-px"
    :class="props.active ? 'text-mc-sage-680 bg-mc-paper-50/72' : ''"
    type="button"
    :aria-current="props.active ? 'page' : undefined"
    @click="emit('select')"
  >
    {{ props.label }}
  </button>
</template>
