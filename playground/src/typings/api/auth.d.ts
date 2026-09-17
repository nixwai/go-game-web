declare namespace Api {
  namespace Auth {
    /** 用户信息。 */
    interface UserResponse {
      id: number
      username: string
      role: 'admin' | 'user'
      status: 'active' | 'disabled'
      created_at: string
    }

    /** 登录结果。 */
    interface LoginResult {
      token: string
      user: UserResponse
    }

    /** 登录请求参数。 */
    interface LoginParams {
      username: string
      /** RSA-OAEP + SHA-256 加密后 base64 编码的密文。 */
      password: string
    }

    /** 注册请求参数。 */
    interface RegisterParams {
      username: string
      /** RSA-OAEP + SHA-256 加密后 base64 编码的密文。 */
      password: string
    }

    /** 修改密码的请求参数。 */
    interface ChangePasswordParams {
      old_password: string
      new_password: string
    }

    /** 登录加密所用的公钥。 */
    interface PublicKeyResult {
      public_key: string
    }
  }
}
