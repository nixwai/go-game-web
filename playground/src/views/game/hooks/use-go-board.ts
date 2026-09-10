import type { GoBoardInstance } from '@go-board/design';
import type { Ref } from 'vue';

/** 封装 GoBoard 组件实例引用与操作。 */
export function useGoBoardRef(boardRef: Ref<GoBoardInstance | null>) {
  function play(position?: Parameters<GoBoardInstance['play']>[0]): boolean {
    return boardRef.value?.play(position) ?? false;
  }

  function reset(options?: Parameters<GoBoardInstance['reset']>[0]): boolean {
    return boardRef.value?.reset(options) ?? false;
  }

  return {
    play,
    reset,
  };
}
