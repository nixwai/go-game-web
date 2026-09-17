/** 用户角色对应的展示文案。 */
export const USER_ROLE_TEXT: Record<Api.Auth.UserResponse['role'], string> = {
  admin: '管理员',
  user: '普通用户',
};

/** 账号状态对应的展示文案。 */
export const USER_STATUS_TEXT: Record<Api.Auth.UserResponse['status'], string> = {
  active: '正常',
  disabled: '已禁用',
};
