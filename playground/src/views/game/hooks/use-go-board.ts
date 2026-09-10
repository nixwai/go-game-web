import type { GoBoardInstance } from '@go-board/design';
import { ref } from 'vue';

/** 封装 GoBoard 组件实例引用与操作。 */
export function useGoBoardRef() {
  const boardRef = ref<GoBoardInstance | null>(null);

  function play(position?: Parameters<GoBoardInstance['play']>[0]): boolean {
    return boardRef.value?.play(position) ?? false;
  }

  function reset(options?: Parameters<GoBoardInstance['reset']>[0]): boolean {
    return boardRef.value?.reset(options) ?? false;
  }

  return {
    boardRef,
    play,
    reset,
  };
}
