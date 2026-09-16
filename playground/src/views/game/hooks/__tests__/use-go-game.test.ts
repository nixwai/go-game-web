import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import type { Ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope, ref } from 'vue';
import { fetchAnalyzeGoGame } from '@/service/api';
import { useGoGame } from '../use-go-game';

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

function createBoardRef(
  play: GoBoardInstance['play'],
  reset: GoBoardInstance['reset'] = vi.fn(() => true),
) {
  return ref({ play, reset } as unknown as GoBoardInstance) as Ref<GoBoardInstance | null>;
}

function setupGame(
  play: GoBoardInstance['play'] = vi.fn(() => true),
  reset: GoBoardInstance['reset'] = vi.fn(() => true),
) {
  const boardRef = createBoardRef(play, reset);
  const scope = effectScope();
  const game = scope.run(() => useGoGame(boardRef))!;

  return { boardRef, game, scope };
}

describe('game AI error recovery', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockedFetchAnalyzeGoGame.mockReset();
  });

  it('接口失败后自动重试并在成功时继续落子', async () => {
    mockedFetchAnalyzeGoGame
      .mockResolvedValueOnce({ data: null, error: new Error('AI 服务暂时不可用') })
      .mockResolvedValueOnce({ data: null, error: new Error('AI 服务暂时不可用') })
      .mockResolvedValueOnce({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const play = vi.fn(() => true);
    const { game, scope } = setupGame(play);

    await game.triggerAI(createSnapshot());

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(3);
    expect(play).toHaveBeenCalledWith([2, 2]);
    expect(game.aiError.value).toBe('');
    expect(game.isAIThinking.value).toBe(false);

    scope.stop();
  });

  it('自动重试失败后显示异常，并支持再次手动重试', async () => {
    for (let attempt = 0; attempt <= 10; attempt++) {
      mockedFetchAnalyzeGoGame.mockResolvedValueOnce({
        data: null,
        error: new Error('AI 服务暂时不可用'),
      });
    }
    mockedFetchAnalyzeGoGame.mockResolvedValueOnce({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const play = vi.fn(() => true);
    const { game, scope } = setupGame(play);

    await game.triggerAI(createSnapshot());

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(11);
    expect(game.aiError.value).toBe('AI 服务暂时不可用');

    await game.handleRetryAI();

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(12);
    expect(play).toHaveBeenCalledWith([2, 2]);
    expect(game.aiError.value).toBe('');

    scope.stop();
  });

  it('下棋位置无效后自动重试并在合法位置落子', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const play = vi.fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const { game, scope } = setupGame(play);

    await game.triggerAI(createSnapshot());

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(3);
    expect(play).toHaveBeenCalledTimes(3);
    expect(game.aiError.value).toBe('');

    scope.stop();
  });

  it('按接口约定传入完整的 ko 信息', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const { game, scope } = setupGame(vi.fn(() => true));
    const snapshot = {
      ...createSnapshot(),
      ko: { sign: -1 as const, vertex: [1, 2] as [number, number] },
    };

    await game.triggerAI(snapshot);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledWith(expect.objectContaining({
      ko: {
        sign: -1,
        vertex: [1, 2],
      },
      latestVertex: [3, 3],
    }));

    scope.stop();
  });

  it('不传入不符合接口约定的无效 ko', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const { game, scope } = setupGame(vi.fn(() => true));
    const snapshot = {
      ...createSnapshot(),
      ko: { sign: 0, vertex: [1, 2] as [number, number] },
    } as GoGameSnapshot;

    await game.triggerAI(snapshot);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledWith(expect.objectContaining({ ko: undefined }));

    scope.stop();
  });

  it('ai 主动结束时提示并支持手动重试', async () => {
    mockedFetchAnalyzeGoGame
      .mockResolvedValueOnce({ data: { action: 'end_game' }, error: null })
      .mockResolvedValueOnce({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const play = vi.fn(() => true);
    const { game, scope } = setupGame(play);

    await game.triggerAI(createSnapshot());

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(1);
    expect(game.aiError.value).toBe('AI申请结束');
    expect(game.isAIThinking.value).toBe(false);

    await game.handleRetryAI();

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(2);
    expect(play).toHaveBeenCalledWith([2, 2]);
    expect(game.aiError.value).toBe('');

    scope.stop();
  });

  it('开始新局时使用传入的棋盘尺寸', () => {
    const reset = vi.fn(() => true);
    const { game, scope } = setupGame(vi.fn(() => true), reset);

    expect(reset).not.toHaveBeenCalled();

    game.handleNewGame(13);

    expect(reset).toHaveBeenCalledWith({ size: 13 });

    scope.stop();
  });

  it('ai 返回无效位置或棋盘拒绝落子时显示异常原因', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'move', vertex: [2, 2] },
      error: null,
    });
    const { game, scope } = setupGame(vi.fn(() => false));

    await game.triggerAI(createSnapshot());

    expect(game.aiError.value).toBe('AI 返回的下棋位置无效，请重试');
    expect(game.isAIThinking.value).toBe(false);

    scope.stop();
  });
});
