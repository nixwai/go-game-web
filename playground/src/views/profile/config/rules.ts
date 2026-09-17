import type { PasswordChangeField, PasswordChangeFormModel } from '../typings';
import { PASSWORD_PATTERN } from '@/views/login/config/rules';

/** 校验修改密码表单，返回字段名到错误信息的映射。 */
export function validatePasswordChangeForm(model: PasswordChangeFormModel): Partial<Record<PasswordChangeField, string>> {
  const errors: Partial<Record<PasswordChangeField, string>> = {};

  if (!model.oldPassword) {
    errors.oldPassword = '请输入原密码';
  }
  else if (model.oldPassword.length < 8 || model.oldPassword.length > 128) {
    errors.oldPassword = '原密码长度应为 8-128 位';
  }

  if (!model.newPassword) {
    errors.newPassword = '请输入新密码';
  }
  else if (model.newPassword.length < 8 || model.newPassword.length > 128) {
    errors.newPassword = '新密码长度应为 8-128 位';
  }
  else if (!PASSWORD_PATTERN.test(model.newPassword)) {
    errors.newPassword = '新密码必须同时包含字母和数字';
  }

  if (!model.confirmPassword) {
    errors.confirmPassword = '请再次输入新密码';
  }
  else if (model.confirmPassword !== model.newPassword) {
    errors.confirmPassword = '两次输入的新密码不一致';
  }

  return errors;
}
