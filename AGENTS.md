# AGENTS.md — AI围棋对弈游戏

## 项目介绍

AI围棋对弈 Web 应用，支持用户认证、AI 产商/模型管理、人机对弈。

后端接口文档：`http://localhost:8080/docs/openapi.yaml`

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.5+ | 前端框架 |
| Vite | 8.x | 构建工具 |
| TypeScript | 6.x | 类型安全 |
| Pinia | 4.x | 状态管理 |
| VueUse | 14.x | 组合式工具库 |
| Vue Router | 5.x | 路由 |
| Axios | 1.x | HTTP 客户端 |
| UnoCSS | 66.x | 原子化 CSS |
| @go-board/design | 0.3.x | 围棋棋盘组件库 |

## 目录结构

```
playground/src/
├── service/          # 请求层（axios 实例 + API 函数）
│   ├── request/      # axios 实例、拦截器、共享辅助
│   └── api/          # 按域分组的 API 函数（fetchXxx 命名）
├── store/            # 状态管理
│   ├── modules/      # store 模块（auth/ai/game），每个含 index.ts + shared.ts
│   └── plugins/      # Pinia 插件（resetSetupStore）
├── typings/          # 类型声明（declare namespace Api 模式）
│   └── api/          # 按域分组的 API 类型
├── hooks/            # 组合式函数
│   ├── common/       # 通用（useRSA、useRouterPush）
│   └── business/     # 业务专用
├── components/       # 公共组件
│   └── common/       # 跨页面复用组件
├── views/            # 页面模块（每个页面为独立目录）
│   ├── login/        # 含 index.vue + hooks/ + config/
│   ├── register/
│   ├── game/         # 含 index.vue + components/ + hooks/ + config/ + typings/
│   └── settings/     # 同上结构
├── constants/        # 常量
├── enum/             # 枚举（SetupStoreId）
├── utils/            # 工具函数
├── layouts/          # 布局组件
├── router/           # 路由（routes + guard）
├── App.vue
└── main.ts
```

## 代码规范

- ESLint：分号必须（`style/semi: error`）、花括号必须（`curly: all`）、每行最多 2 条语句
- Stylelint：recess-order 属性排序
- 命名：文件 kebab-case，组件 PascalCase，函数 camelCase，API 函数 `fetchXxx`
- 类型声明：使用 `declare namespace Api.Xxx` 全局命名空间模式，放在 `typings/api/` 下

## 状态管理规范

- Pinia setup 语法，每个模块在 `store/modules/xxx/` 下
- 每个模块包含 `index.ts`（store 定义）和 `shared.ts`（纯函数辅助）
- 持久化使用 VueUse `useStorage`，通过 `utils/storage.ts` 统一封装
- `store/plugins/resetSetupStore.ts` 为 setup 语法 store 注入 `$reset`

## API 集成规范

- axios 实例在 `service/request/index.ts`，使用 flat request 模式返回 `{ data, error }` 元组
- 请求拦截器：注入 `Authorization` + `X-Request-ID`
- 响应拦截器：解析 `{ code, message, data }` 信封，`code=0` 成功，`code=2002` 清 token 跳登录
- API 函数在 `service/api/` 按域分组，命名为 `fetchXxx`
- 密码加密：RSA-OAEP + SHA-256，通过 `hooks/common/crypto.ts` 的 `useRSA()` 封装

## 页面模块化规范

- 每个 view 为独立目录：`index.vue` + `components/` + `hooks/` + `config/` + `typings/`
- hook 按职责拆分：`use-xxx-query.ts`、`use-xxx-submit.ts`、`use-xxx-delete.ts`
- 跨页面复用组件放 `components/common/`

## GoBoard 组件约定

- 使用 `GoSave` 包裹 `GoBoard` 提供存档/历史功能
- `GoHistoryButton`（step=-1 后退/step=1 前进/step=0 清空）+ `GoHistorySlider`（拖拽回放）
- GoBoard `play(position)` 后自动 rotate 切换执棋方
- AI 调度：`onMove` 回调中检查 `snapshot.player === -1`（白方=AI）时触发 `fetchAnalyzeGoGame`
- AI 开关为客户端 Pinia 状态，关闭后双方手动落子

## 开发注意事项

- 棋盘尺寸仅支持 9/13/19（`constants/app.ts` 的 `BOARD_SIZES`）
- AI 开关为纯客户端状态，不调后端接口；模型切换才调 `setting/update`
- 人类执黑（先手），AI 执白（后手）
- `isAIThinking` 状态防止 AI 重复调用
- Vite proxy 将 `/api` 和 `/health` 代理到 `http://localhost:8080`
- 路径别名 `@/` 指向 `playground/src/`
