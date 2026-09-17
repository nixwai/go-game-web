import type { PasswordChangeFormModel } from '../../typings';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePasswordChange } from '../use-password-change';

const mocks = vi.hoisted(() => ({ changePassword: vi.fn() }));

vi.mock('@/store/modules/auth', () => ({ useAuthStore: () => ({ changePassword: mocks.changePassword }) }));

function createForm(overrides: Partial<PasswordChangeFormModel> = {}): PasswordChangeFormModel {
  return {
    oldPassword: 'Secret123',
    newPassword: 'NewSecret123',
    confirmPassword: 'NewSecret123',
    ...overrides,
  };
}

describe('usePasswordChange', () => {
  beforeEach(() => {
    mocks.changePassword.mockReset();
  });

  it('rejects invalid input without sending a request', async () => {
    const { errorMsg, handleSubmit } = usePasswordChange();

    const success = await handleSubmit(createForm({ confirmPassword: 'Mismatch123' }));

    expect(success).toBe(false);
    expect(mocks.changePassword).not.toHaveBeenCalled();
    expect(errorMsg.value).toBe('两次输入的新密码不一致');
  });

  it('reports success after the password is updated', async () => {
    mocks.changePassword.mockResolvedValue(true);
    const { errorMsg, handleSubmit, loading, successMsg } = usePasswordChange();

    const success = await handleSubmit(createForm());

    expect(success).toBe(true);
    expect(mocks.changePassword).toHaveBeenCalledWith('Secret123', 'NewSecret123');
    expect(errorMsg.value).toBe('');
    expect(successMsg.value).toBe('密码修改成功');
    expect(loading.value).toBe(false);
  });

  it('reports a failure when the old password is rejected', async () => {
    mocks.changePassword.mockResolvedValue(false);
    const { errorMsg, handleSubmit } = usePasswordChange();

    const success = await handleSubmit(createForm());

    expect(success).toBe(false);
    expect(errorMsg.value).toBe('修改失败，请检查原密码和新密码');
  });

  it('recovers from a thrown error and allows retrying', async () => {
    mocks.changePassword
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce(true);
    const { errorMsg, handleSubmit, loading, successMsg } = usePasswordChange();

    await handleSubmit(createForm());

    expect(errorMsg.value).toBe('修改失败，请稍后重试');
    expect(loading.value).toBe(false);

    const success = await handleSubmit(createForm());

    expect(success).toBe(true);
    expect(errorMsg.value).toBe('');
    expect(successMsg.value).toBe('密码修改成功');
  });

  it('ignores a submit while another one is in flight', async () => {
    let resolveRequest: (value: boolean) => void = () => {};
    mocks.changePassword.mockReturnValue(new Promise<boolean>((resolve) => {
      resolveRequest = resolve;
    }));
    const { handleSubmit, loading } = usePasswordChange();

    const pending = handleSubmit(createForm());
    const duplicated = await handleSubmit(createForm());

    expect(duplicated).toBe(false);
    expect(mocks.changePassword).toHaveBeenCalledTimes(1);
    expect(loading.value).toBe(true);

    resolveRequest(true);
    await pending;

    expect(loading.value).toBe(false);
  });
});
