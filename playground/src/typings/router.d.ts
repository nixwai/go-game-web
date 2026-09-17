import 'vue-router';

declare module 'vue-router' {
  /** 路由元信息。 */
  interface RouteMeta {
    /** 页面标题。 */
    title?: string
    /** 是否需要登录后访问。 */
    requiresAuth?: boolean
    /** 是否无需登录即可访问。 */
    constant?: boolean
  }
}
