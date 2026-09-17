import { describe, expect, it } from 'vitest';
import { USER_ROLE_TEXT, USER_STATUS_TEXT } from '../user-info';

describe('user info text', () => {
  it('maps the role and status returned by the api', () => {
    expect(USER_ROLE_TEXT.admin).toBe('管理员');
    expect(USER_ROLE_TEXT.user).toBe('普通用户');
    expect(USER_STATUS_TEXT.active).toBe('正常');
    expect(USER_STATUS_TEXT.disabled).toBe('已禁用');
  });
});
