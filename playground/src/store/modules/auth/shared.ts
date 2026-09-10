import { localStg } from '@/utils/storage';

export function getToken() {
  return localStg.token.value || '';
}

export function clearAuthStorage() {
  localStg.token.value = '';
}
