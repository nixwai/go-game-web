/** 主导航项。 */
export interface MainNavItem {
  /** 目标路由名，用于判断选中态。 */
  name: string
  /** 目标路由路径。 */
  path: string
  /** 导航文案。 */
  label: string
}

/** 页脚源码链接。 */
export interface FooterLink {
  /** 链接文案。 */
  label: string
  /** 链接地址。 */
  href: string
}
