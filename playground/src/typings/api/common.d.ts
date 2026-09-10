declare namespace Api {
  /** 后端统一响应信封。 */
  interface Response<T = unknown> {
    /** 业务码，0 表示成功。 */
    code: number
    /** 面向客户端的简短提示。 */
    message: string
    /** 业务数据，成功时返回具体内容，失败时为 null。 */
    data: T | null
  }
}
