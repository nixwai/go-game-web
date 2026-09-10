import { request } from '../request';

/** 获取 RSA 公钥。 */
export function fetchPublicKey() {
  return request.get<Api.Auth.PublicKeyResult>({ url: '/api/v1/auth/public-key' });
}

/** 用户注册。 */
export function fetchRegister(data: Api.Auth.RegisterParams) {
  return request.post<{ id: number }>({
    url: '/api/v1/auth/register',
    data,
  });
}

/** 用户登录。 */
export function fetchLogin(data: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResult>({
    url: '/api/v1/auth/login',
    data,
  });
}

/** 获取当前用户信息。 */
export function fetchCurrentUser() {
  return request.get<Api.Auth.UserResponse>({ url: '/api/v1/auth/me' });
}

/** 修改密码。 */
export function fetchChangePassword(data: Api.Auth.ChangePasswordParams) {
  return request.post<null>({
    url: '/api/v1/auth/password/update',
    data,
  });
}
