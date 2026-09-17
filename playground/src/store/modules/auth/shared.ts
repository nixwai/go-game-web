import { localStg } from '@/utils/storage';

/** 读取本地存储中的令牌。 */
export function getToken() {
  return localStg.token.value || '';
}

/** 清除本地存储中的令牌。 */
export function clearAuthStorage() {
  localStg.token.value = '';
}
