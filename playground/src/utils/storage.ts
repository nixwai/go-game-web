import type { RemovableRef } from '@vueuse/core';
import { useStorage } from '@vueuse/core';
import { STORAGE_PREFIX } from '@/constants/app';

export function createStorageItem(key: string): RemovableRef<string> {
  return useStorage(STORAGE_PREFIX + key, '', localStorage);
}

export const localStg = { get token() { return createStorageItem('token'); } } as const;
