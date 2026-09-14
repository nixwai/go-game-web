import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAnalyzeGoGame } from '@/service/api';
import { useGameStore } from '../index';

vi.mock('@/service/api', () => ({
  fetchAnalyzeGoGame: vi.fn(),
  fetchGoGameSetting: vi.fn(),
  fetchUpdateGoGameSetting: vi.fn(),
}));

const mockedFetchAnalyzeGoGame = vi.mocked(fetchAnalyzeGoGame);

function createSnapshot(): GoGameSnapshot {
  return {
    size: 9,
    layout: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0 as -1 | 0 | 1)),
    player: -1,
    latestVertex: [3, 3],
  };
}

function createBoardRef(play: GoBoardInstance['play']) {
  return { value: { play } } as { value: GoBoardInstance };
}

describe('game store AI error recovery', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockedFetchAnalyzeGoGame.mockReset();
  });

  it('保存 AI 接口错误原因，并通过重试重新发起请求', async () => {
    mockedFetchAnalyzeGoGame
      .mockResolvedValueOnce({ data: null, error: new Error('AI 服务暂时不可用') })
      .mockResolvedValueOnce({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const play = vi.fn(() => true);
    const boardRef = createBoardRef(play);
    const store = useGameStore();
    const snapshot = createSnapshot();

    await store.triggerAI(boardRef, snapshot);

    expect(store.aiError).toBe('AI 服务暂时不可用');
    expect(store.isAIThinking).toBe(false);

    await store.retryAI(boardRef);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(2);
    expect(play).toHaveBeenCalledWith([2, 2]);
    expect(store.aiError).toBe('');
  });

  it('按接口约定传入完整的 ko 信息', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const boardRef = createBoardRef(vi.fn(() => true));
    const store = useGameStore();
    const snapshot = {
      ...createSnapshot(),
      ko: { sign: -1 as const, vertex: [1, 2] as [number, number] },
    };

    await store.triggerAI(boardRef, snapshot);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledWith(expect.objectContaining({
      ko: {
        sign: -1,
        vertex: [1, 2],
      },
      latestVertex: [3, 3],
    }));
  });

  it('不传入不符合接口约定的无效 ko', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const boardRef = createBoardRef(vi.fn(() => true));
    const store = useGameStore();
    const snapshot = {
      ...createSnapshot(),
      ko: { sign: 0, vertex: [1, 2] as [number, number] },
    } as GoGameSnapshot;

    await store.triggerAI(boardRef, snapshot);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledWith(expect.objectContaining({ ko: undefined }));
  });

  it('ai 返回无效位置或棋盘拒绝落子时显示异常原因', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const boardRef = createBoardRef(vi.fn(() => false));
    const store = useGameStore();

    await store.triggerAI(boardRef, createSnapshot());

    expect(store.aiError).toBe('AI 返回的下棋位置无效，请重试');
    expect(store.isAIThinking).toBe(false);
  });
});
