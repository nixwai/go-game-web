<script setup lang="ts">
import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import { GoBoard, GoHistoryButton, GoHistorySlider, GoSave } from '@go-board/design';

interface Props {
  boardSize: number
  showCoord?: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'move', snapshot: GoGameSnapshot): void
  (e: 'update', snapshot: GoGameSnapshot): void
}

const props = withDefaults(defineProps<Props>(), {
  showCoord: false,
  disabled: false,
});

const emit = defineEmits<Emits>();

const boardRef = defineModel<GoBoardInstance | null>('boardRef');

defineExpose({
  play: (position?: Parameters<GoBoardInstance['play']>[0]) => boardRef.value?.play(position),
  reset: (options?: Parameters<GoBoardInstance['reset']>[0]) => boardRef.value?.reset(options),
});
</script>

<template>
  <GoSave>
    <div class="game-board flex flex-col gap-12px">
      <div class="flex items-center gap-8px">
        <GoHistoryButton :step="-1" :disabled="props.disabled">
          后退
        </GoHistoryButton>
        <GoHistoryButton :step="1" :disabled="props.disabled">
          前进
        </GoHistoryButton>
        <GoHistoryButton :step="0" :disabled="props.disabled">
          清空
        </GoHistoryButton>
      </div>
      <GoBoard
        ref="boardRef"
        :init="{ size: props.boardSize }"
        :show-coord="props.showCoord"
        :disabled="props.disabled"
        width="600px"
        @move="emit('move', $event)"
        @update="emit('update', $event)"
      />
      <GoHistorySlider :disabled="props.disabled" />
    </div>
  </GoSave>
</template>
