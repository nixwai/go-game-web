/** 修改密码表单字段。 */
export type PasswordChangeField = 'oldPassword' | 'newPassword' | 'confirmPassword';

/** 修改密码表单数据。 */
export interface PasswordChangeFormModel {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
