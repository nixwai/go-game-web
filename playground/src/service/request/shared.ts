import type { RequestInstanceState } from './type';
import { localStg } from '@/utils/storage';

const ERROR_MESSAGE_DURATION = 3000;

/** 获取认证头。 */
export function getAuthorization(): string | undefined {
  const token = localStg.token.value;

  return token ? `Bearer ${token}` : undefined;
}

/** 向用户展示错误消息，并在短时间内去重，避免并发请求重复打扰用户。 */
export function showErrorMsg(state: RequestInstanceState, message: string): void {
  const normalizedMessage = message.trim() || '请求失败';

  if (state.errMsgStack.includes(normalizedMessage)) {
    return;
  }

  state.errMsgStack = [...state.errMsgStack, normalizedMessage];
  state.errorMessage = normalizedMessage;
  console.error(normalizedMessage);

  setTimeout(() => {
    state.errMsgStack = state.errMsgStack.filter(item => item !== normalizedMessage);

    if (state.errorMessage === normalizedMessage) {
      state.errorMessage = '';
    }
  }, ERROR_MESSAGE_DURATION);
}
