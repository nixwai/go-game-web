/** 支持的对局棋盘边长。 */
export const BOARD_SIZES = [9, 13, 19] as const;

/** 棋盘边长类型。 */
export type BoardSize = (typeof BOARD_SIZES)[number];

/** 后端业务状态码。 */
export const BUSINESS_CODE = {
  SUCCESS: 0,
  VALIDATION_FAILED: 1001,
  AUTH_FAILED: 2001,
  TOKEN_INVALID: 2002,
  FORBIDDEN: 3001,
  CONFLICT: 4001,
  NOT_FOUND: 4004,
  DEFAULT_READONLY: 4005,
  RSA_DECRYPT_FAILED: 4006,
  MODEL_DISABLED: 4007,
  SERVER_ERROR: 9000,
  MASTER_KEY_INVALID: 9001,
  LLM_CALL_FAILED: 9002,
  LLM_FORMAT_INVALID: 9003,
} as const;

/** 触发退出登录的业务状态码。 */
export const LOGOUT_CODES: number[] = [BUSINESS_CODE.TOKEN_INVALID];

/** 本地存储键的统一前缀。 */
export const STORAGE_PREFIX = 'go_game_';
