import type { GoBoardInstance, GoGameSnapshot } from '@go-board/design';
import type { Ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope, ref } from 'vue';
import { fetchAnalyzeGoGame } from '@/service/api';
import { useAIMove } from '../use-ai-move';

vi.mock('@/service/api', () => ({ fetchAnalyzeGoGame: vi.fn() }));

const mockedFetchAnalyzeGoGame = vi.mocked(fetchAnalyzeGoGame);

type AnalyzeResponse = Awaited<ReturnType<typeof fetchAnalyzeGoGame>>;

function createSnapshot(): GoGameSnapshot {
  return {
    size: 9,
    layout: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0 as -1 | 0 | 1)),
    player: -1,
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

function setupAIMove(play: GoBoardInstance['play'] = vi.fn(() => true)) {
  const boardRef = ref({ play } as unknown as GoBoardInstance) as Ref<GoBoardInstance | null>;
  const scope = effectScope();
  const aiMove = scope.run(() => useAIMove(boardRef))!;

  return { aiMove, play, scope };
}

describe('useAIMove', () => {
  beforeEach(() => {
    mockedFetchAnalyzeGoGame.mockReset();
  });

  it('接口失败后自动重试并在成功时落子', async () => {
    mockedFetchAnalyzeGoGame
      .mockResolvedValueOnce({ data: null, error: new Error('AI 服务暂时不可用') })
      .mockResolvedValueOnce({ data: null, error: new Error('AI 服务暂时不可用') })
      .mockResolvedValueOnce({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const { aiMove, play, scope } = setupAIMove();

    await expect(aiMove.move(createSnapshot())).resolves.toBe(true);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(3);
    expect(play).toHaveBeenCalledWith([2, 2]);
    expect(aiMove.error.value).toBe('');
    expect(aiMove.thinking.value).toBe(false);

    scope.stop();
  });

  it('达到重试上限后保留最后一次失败提示', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: null, error: new Error('AI 服务暂时不可用') });
    const { aiMove, play, scope } = setupAIMove();

    await expect(aiMove.move(createSnapshot())).resolves.toBe(false);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(11);
    expect(play).not.toHaveBeenCalled();
    expect(aiMove.error.value).toBe('AI 服务暂时不可用');
    expect(aiMove.thinking.value).toBe(false);

    scope.stop();
  });

  it('请求抛异常时转为失败提示', async () => {
    mockedFetchAnalyzeGoGame.mockRejectedValue(new Error('网络异常'));
    const { aiMove, scope } = setupAIMove();

    await expect(aiMove.move(createSnapshot())).resolves.toBe(false);

    expect(aiMove.error.value).toBe('网络异常');
    expect(aiMove.thinking.value).toBe(false);

    scope.stop();
  });

  it('落子位置无效后自动重试直到棋盘接受', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const play = vi.fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const { aiMove, scope } = setupAIMove(play);

    await expect(aiMove.move(createSnapshot())).resolves.toBe(true);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(3);
    expect(play).toHaveBeenCalledTimes(3);
    expect(aiMove.error.value).toBe('');

    scope.stop();
  });

  it('棋盘始终拒绝落子时提示位置无效', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const { aiMove, scope } = setupAIMove(vi.fn(() => false));

    await expect(aiMove.move(createSnapshot())).resolves.toBe(false);

    expect(aiMove.error.value).toBe('AI 返回的下棋位置无效，请重试');
    expect(aiMove.thinking.value).toBe(false);

    scope.stop();
  });

  it('ai 未返回落子位置时提示位置无效', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move' }, error: null });
    const { aiMove, play, scope } = setupAIMove();

    await expect(aiMove.move(createSnapshot())).resolves.toBe(false);

    expect(play).not.toHaveBeenCalled();
    expect(aiMove.error.value).toBe('AI 返回的下棋位置无效，请重试');

    scope.stop();
  });

  it('ai 返回未知动作时提示响应无效并重试', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({
      data: { action: 'unknown' } as unknown as Api.AiGo.AnalyzeResult,
      error: null,
    });
    const { aiMove, play, scope } = setupAIMove();

    await expect(aiMove.move(createSnapshot())).resolves.toBe(false);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(11);
    expect(play).not.toHaveBeenCalled();
    expect(aiMove.error.value).toBe('AI 返回了无效的响应，请重试');

    scope.stop();
  });

  it('ai 主动结束时立即提示且不再重试', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'end_game' }, error: null });
    const { aiMove, play, scope } = setupAIMove();

    await expect(aiMove.move(createSnapshot())).resolves.toBe(false);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(1);
    expect(play).not.toHaveBeenCalled();
    expect(aiMove.error.value).toBe('AI申请结束');
    expect(aiMove.thinking.value).toBe(false);

    scope.stop();
  });

  it('按接口约定传入完整的 ko 信息', async () => {
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const { aiMove, scope } = setupAIMove();
    const snapshot = {
      ...createSnapshot(),
      ko: { sign: -1 as const, vertex: [1, 2] as [number, number] },
    };

    await aiMove.move(snapshot);

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
    mockedFetchAnalyzeGoGame.mockResolvedValue({ data: { action: 'move', vertex: [2, 2] }, error: null });
    const { aiMove, scope } = setupAIMove();
    const snapshot = {
      ...createSnapshot(),
      ko: { sign: 0, vertex: [1, 2] as [number, number] },
    } as GoGameSnapshot;

    await aiMove.move(snapshot);

    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledWith(expect.objectContaining({ ko: undefined }));

    scope.stop();
  });

  it('落子进行中忽略重复触发', async () => {
    const deferred = createDeferred();
    mockedFetchAnalyzeGoGame.mockReturnValue(deferred.promise);
    const { aiMove, scope } = setupAIMove();

    const pending = aiMove.move(createSnapshot());
    const duplicated = await aiMove.move(createSnapshot());

    expect(duplicated).toBe(false);
    expect(mockedFetchAnalyzeGoGame).toHaveBeenCalledTimes(1);
    expect(aiMove.thinking.value).toBe(true);

    deferred.resolve({ data: { action: 'move', vertex: [2, 2] }, error: null });

    await expect(pending).resolves.toBe(true);
    expect(aiMove.thinking.value).toBe(false);

    scope.stop();
  });

  it('取消后丢弃进行中的请求结果', async () => {
    const deferred = createDeferred();
    mockedFetchAnalyzeGoGame.mockReturnValue(deferred.promise);
    const { aiMove, play, scope } = setupAIMove();

    const pending = aiMove.move(createSnapshot());

    aiMove.cancel();
    deferred.resolve({ data: { action: 'move', vertex: [2, 2] }, error: null });

    await expect(pending).resolves.toBe(false);
    expect(play).not.toHaveBeenCalled();
    expect(aiMove.thinking.value).toBe(false);
    expect(aiMove.error.value).toBe('');

    scope.stop();
  });
});
