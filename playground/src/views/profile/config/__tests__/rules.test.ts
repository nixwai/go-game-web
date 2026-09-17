import { describe, expect, it } from 'vitest';
import { validatePasswordChangeForm } from '../rules';

describe('validatePasswordChangeForm', () => {
  it('requires all password fields', () => {
    const errors = validatePasswordChangeForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    expect(errors).toEqual({
      oldPassword: '请输入原密码',
      newPassword: '请输入新密码',
      confirmPassword: '请再次输入新密码',
    });
  });

  it('validates the new password format', () => {
    const errors = validatePasswordChangeForm({
      oldPassword: 'Secret123',
      newPassword: 'onlyletters',
      confirmPassword: 'onlyletters',
    });

    expect(errors).toEqual({ newPassword: '新密码必须同时包含字母和数字' });
  });

  it('requires the confirmation password to match', () => {
    const errors = validatePasswordChangeForm({
      oldPassword: 'Secret123',
      newPassword: 'NewSecret123',
      confirmPassword: 'NewSecret456',
    });

    expect(errors).toEqual({ confirmPassword: '两次输入的新密码不一致' });
  });

  it('accepts a valid password change form', () => {
    const errors = validatePasswordChangeForm({
      oldPassword: 'Secret123',
      newPassword: 'NewSecret123',
      confirmPassword: 'NewSecret123',
    });

    expect(errors).toEqual({});
  });
});
