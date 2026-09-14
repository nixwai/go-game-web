import type { RequestInstanceState } from '../type';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { showErrorMsg } from '../shared';

const ERROR_MESSAGE_DURATION = 3000;

describe('showErrorMsg', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should expose the error message for the UI and log it', () => {
    vi.useFakeTimers();
    const state: RequestInstanceState = { errMsgStack: [], errorMessage: '' };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    showErrorMsg(state, '请求失败');

    expect(state.errorMessage).toBe('请求失败');
    expect(state.errMsgStack).toEqual(['请求失败']);
    expect(consoleError).toHaveBeenCalledWith('请求失败');
  });

  it('should suppress the same message while it is visible and allow it again after expiry', () => {
    vi.useFakeTimers();
    const state: RequestInstanceState = { errMsgStack: [], errorMessage: '' };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    showErrorMsg(state, '网络异常');
    showErrorMsg(state, '网络异常');

    expect(consoleError).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(ERROR_MESSAGE_DURATION);
    expect(state.errorMessage).toBe('');
    expect(state.errMsgStack).toEqual([]);

    showErrorMsg(state, '网络异常');
    expect(consoleError).toHaveBeenCalledTimes(2);
    expect(state.errorMessage).toBe('网络异常');
  });

  it('should normalize empty messages to a user-friendly fallback', () => {
    const state: RequestInstanceState = { errMsgStack: [], errorMessage: '' };

    showErrorMsg(state, '  ');

    expect(state.errorMessage).toBe('请求失败');
    expect(state.errMsgStack).toEqual(['请求失败']);
  });
});
