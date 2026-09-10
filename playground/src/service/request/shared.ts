import type { RequestInstanceState } from './type';
import { localStg } from '@/utils/storage';

/** 获取认证头。 */
export function getAuthorization(): string | undefined {
  const token = localStg.token.value;

  return token ? `Bearer ${token}` : undefined;
}

/** 去重展示错误消息。 */
export function showErrorMsg(state: RequestInstanceState, message: string): void {
  if (!state.errMsgStack.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    console.error(message);
  }
}
