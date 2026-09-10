declare namespace Api {
  namespace Auth {
    interface UserResponse {
      id: number
      username: string
      role: 'admin' | 'user'
      status: 'active' | 'disabled'
      created_at: string
    }

    interface LoginResult {
      token: string
      user: UserResponse
    }

    interface LoginParams {
      username: string
      /** RSA-OAEP + SHA-256 加密后 base64 编码的密文。 */
      password: string
    }

    interface RegisterParams {
      username: string
      /** RSA-OAEP + SHA-256 加密后 base64 编码的密文。 */
      password: string
    }

    interface ChangePasswordParams {
      old_password: string
      new_password: string
    }

    interface PublicKeyResult {
      public_key: string
    }
  }
}
