import type { RemovableRef } from '@vueuse/core';
import { useStorage } from '@vueuse/core';
import { STORAGE_PREFIX } from '@/constants/app';

/** 创建带统一前缀的字符串本地存储项。 */
export function createStorageItem(key: string): RemovableRef<string> {
  return useStorage(STORAGE_PREFIX + key, '', localStorage);
}

/** 项目使用的本地存储项。 */
export const localStg = { get token() { return createStorageItem('token'); } } as const;
