import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import type { Ref } from 'vue';
import type { BoardSize } from '@/constants/app';
import { computed, nextTick, ref, shallowRef } from 'vue';
import { DEFAULT_BOARD_SIZE } from '../config/constants';
import { useAIMove } from './use-ai-move';

/** 编排对局状态、AI 落子调度与玩家动作。 */
export function useGoGame(boardRef: Ref<GoBoardInstance | null>) {
  const boardSize = ref<BoardSize>(DEFAULT_BOARD_SIZE);
  const aiEnabled = ref(true);
  const { thinking: isAIThinking, error: aiError, clearError, cancel, move } = useAIMove(boardRef);
  const snapshot = shallowRef<GoGameSnapshot | null>(null);

  const currentPlayer = computed(() => snapshot.value?.player ?? 1);

  /** 初始化对局：使进行中的 AI 请求失效并复位提示。 */
  function initGame() {
    cancel();
  }

  /** 按当前局面重新请求 AI 落子。 */
  async function retryAI(): Promise<boolean> {
    if (!snapshot.value) {
      return false;
    }

    return move(snapshot.value);
  }

  /** 切换 AI 自动落子；开启后轮到白方时立即请求落子。 */
  function toggleAI() {
    aiEnabled.value = !aiEnabled.value;

    if (aiEnabled.value && currentPlayer.value === -1) {
      void retryAI();
    }
  }

  /** 记录棋盘变化，轮到白方时交由 AI 落子。 */
  function onMove(nextSnapshot: GoGameSnapshot) {
    snapshot.value = nextSnapshot;
    clearError();

    if (!aiEnabled.value || nextSnapshot.player !== -1) {
      return;
    }

    void move(nextSnapshot);
  }

  /** 记录棋盘变化并清除上一次的失败提示。 */
  function onUpdate(nextSnapshot: GoGameSnapshot) {
    snapshot.value = nextSnapshot;
    clearError();
  }

  /** 停一手：推进当前回合，轮到白方时交由 AI 继续落子。 */
  async function handlePass() {
    if (!boardRef.value?.play()) {
      return;
    }

    await nextTick();

    if (aiEnabled.value && currentPlayer.value === -1) {
      await retryAI();
    }
  }

  /** 按当前棋盘尺寸开始新局。 */
  function handleNewGame() {
    cancel();
    boardRef.value?.reset({ size: boardSize.value });
    snapshot.value = null;
  }

  return {
    boardSize,
    aiEnabled,
    isAIThinking,
    aiError,
    currentPlayer,
    initGame,
    retryAI,
    toggleAI,
    onMove,
    onUpdate,
    handlePass,
    handleNewGame,
  };
}
