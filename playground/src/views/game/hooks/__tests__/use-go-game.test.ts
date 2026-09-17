import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import type { Mock } from 'vitest';
import type { Ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';
import { fetchAnalyzeGoGame } from '@/service/api';
import { useGoGame } from '../use-go-game';

vi.mock('@/service/api', () => ({ fetchAnalyzeGoGame: vi.fn() }));

const mockedFetchAnalyzeGoGame = vi.mocked(fetchAnalyzeGoGame);

type AnalyzeResponse = Awaited<ReturnType<typeof fetchAnalyzeGoGame>>;

function createSnapshot(player: -1 | 1 = -1): GoGameSnapshot {
  return {
    size: 9,
    layout: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0 as -1 | 0 | 1)),
    player,
    latestVertex: [3, 3],
  };
}

function createDeferred() {
  let resolve: (value: AnalyzeResponse) => void = () => {};
  const promise = new Promise<AnalyzeResponse>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

function setupGame(
  play: Mock<GoBoardInstance['play']> = vi.fn(() => true),
  reset: Mock<GoBoardInstance['reset']> = vi.fn(() => true),
) {
  const boardRef = ref({ play, reset } as unknown as GoBoardInstance) as Ref<GoBoardInstance | null>;
  const scope = effectScope();
  const game = scope.run(() => useGoGame(boardRef))!;

  return { game, play, reset, scope };
}

describe('useGoGame', () => {
  beforeEach(() => {
    mockedFetchAnalyzeGoGame.mockReset();
  });

  it('轮到白方时自动请求 AI 落子', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const { game, play, scope } = setupGame();

    game.onMove(createSnapshot());

    await vi.waitFor(() => expect(play).toHaveBeenCalledWith([2, 2]));
    expect(game.aiError.value).toBe('');
    expect(game.isAIThinking.value).toBe(false);

    scope.stop();
  });

  it('轮到黑方时不请求 AI 落子', async () => {
    const { game, scope } = setupGame();

    game.onMove(createSnapshot(1));
    await nextTick();

    expect(mockedFetchAnalyzeGoGame).not.toHaveBeenCalled();

    scope.stop();
  });

  it('关闭 AI 后不请求 AI 落子', async () => {
    const { game, scope } = setupGame();

    game.toggleAI();
    game.onMove(createSnapshot());
    await nextTick();

    expect(mockedFetchAnalyzeGoGame).not.toHaveBeenCalled();

    scope.stop();
  });

  it('开启 AI 且轮到白方时立即请求落子', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move', vertex: [3, 3] }, error: null });
    const { game, play, scope } = setupGame();

    game.onUpdate(createSnapshot());
    game.toggleAI();
    game.toggleAI();

    await vi.waitFor(() => expect(play).toHaveBeenCalledWith([3, 3]));

    scope.stop();
  });

  it('停一手后轮到白方时请求 AI 落子', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const { game, play, scope } = setupGame();
    play.mockImplementation(() => {
      // 模拟棋盘推进回合后轮到白方
      game.onUpdate(createSnapshot());
      return true;
    });

    await game.handlePass();

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledWith([2, 2]);

    scope.stop();
  });

  it('停一手失败时不请求 AI 落子', async () => {
    const { game, scope } = setupGame(vi.fn(() => false));

    await game.handlePass();

    expect(mockedFetchAnalyzeGoGame).not.toHaveBeenCalled();

    scope.stop();
  });

  it('关闭 AI 后停一手不请求 AI 落子', async () => {
    const { game, play, scope } = setupGame();
    play.mockImplementation(() => {
      game.onUpdate(createSnapshot());
      return true;
    });
    game.toggleAI();

    await game.handlePass();

    expect(mockedFetchAnalyzeGoGame).not.toHaveBeenCalled();

    scope.stop();
  });

  it('开始新局时按当前棋盘尺寸重置棋盘', () => {
    const { game, reset, scope } = setupGame();

    game.handleNewGame();

    expect(reset).toHaveBeenCalledWith({ size: 9 });

    game.boardSize.value = 13;
    game.handleNewGame();

    expect(reset).toHaveBeenLastCalledWith({ size: 13 });

    scope.stop();
  });

  it('没有局面时重新请求直接失败', async () => {
    const { game, scope } = setupGame();

    await expect(game.retryAI()).resolves.toBe(false);
    expect(mockedFetchAnalyzeGoGame).not.toHaveBeenCalled();

    scope.stop();
  });

  it('重新请求时使用当前局面并透出失败提示', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: null, error: new Error('AI 服务暂时不可用') });
    const { game, play, scope } = setupGame();

    game.onUpdate(createSnapshot());

    await expect(game.retryAI()).resolves.toBe(false);

    expect(game.aiError.value).toBe('AI 服务暂时不可用');
    expect(play).not.toHaveBeenCalled();

    scope.stop();
  });

  it('开始新局后丢弃进行中的 AI 请求结果', async () => {
    const deferred = createDeferred();
    mockedFetchAnalyzeGoGame.mockReturnValue(deferred.promise);
    const { game, play, scope } = setupGame();

    game.onUpdate(createSnapshot());
    const pending = game.retryAI();

    game.handleNewGame();
    deferred.resolve({ data: { action: 'move', vertex: [2, 2] }, error: null });

    await expect(pending).resolves.toBe(false);
    expect(play).not.toHaveBeenCalled();
    expect(game.isAIThinking.value).toBe(false);
    expect(game.aiError.value).toBe('');

    scope.stop();
  });
});
