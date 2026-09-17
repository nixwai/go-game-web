import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchChangePassword } from '@/service/api';
import { useAuthStore } from '../index';

const mocks = vi.hoisted(() => ({
  encrypt: vi.fn(async (value: string) => `encrypted:${value}`),
  redirectFromLogin: vi.fn(),
  toLogin: vi.fn(),
}));

vi.mock('@/hooks/common/crypto', () => ({ useRSA: () => ({ encrypt: mocks.encrypt }) }));

vi.mock('@/hooks/common/router', () => ({
  useRouterPush: () => ({
    toLogin: mocks.toLogin,
    redirectFromLogin: mocks.redirectFromLogin,
  }),
}));

vi.mock('@/service/api', () => ({
  fetchChangePassword: vi.fn(),
  fetchCurrentUser: vi.fn(),
  fetchLogin: vi.fn(),
  fetchRegister: vi.fn(),
}));

const mockedFetchChangePassword = vi.mocked(fetchChangePassword);

describe('useAuthStore.changePassword', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mocks.encrypt.mockClear();
    mockedFetchChangePassword.mockReset();
  });

  it('encrypts the old and new passwords before submitting', async () => {
    mockedFetchChangePassword.mockResolvedValue({ data: null, error: null });
    const authStore = useAuthStore();

    const success = await authStore.changePassword('Secret123', 'NewSecret123');

    expect(success).toBe(true);
    expect(mocks.encrypt).toHaveBeenNthCalledWith(1, 'Secret123');
    expect(mocks.encrypt).toHaveBeenNthCalledWith(2, 'NewSecret123');
    expect(mockedFetchChangePassword).toHaveBeenCalledWith({
      old_password: 'encrypted:Secret123',
      new_password: 'encrypted:NewSecret123',
    });
  });

  it('returns false when the password update request fails', async () => {
    mockedFetchChangePassword.mockResolvedValue({ data: null, error: new Error('原密码错误') });
    const authStore = useAuthStore();

    const success = await authStore.changePassword('Wrong123', 'NewSecret123');

    expect(success).toBe(false);
  });
});
