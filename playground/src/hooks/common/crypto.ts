import { ref } from 'vue';
import { fetchPublicKey } from '@/service/api';
import { encryptWithRSA, importRSAPublicKey } from '@/utils/crypto';

let cachedKey: CryptoKey | null = null;

/** 提供公钥获取与 RSA 加密能力。 */
export function useRSA() {
  const loading = ref(false);

  async function ensureKey(): Promise<CryptoKey> {
    if (cachedKey) {
      return cachedKey;
    }

    loading.value = true;

    try {
      const { data, error } = await fetchPublicKey();

      if (error || !data) {
        throw new Error('获取公钥失败');
      }

      cachedKey = await importRSAPublicKey(data.public_key);

      return cachedKey;
    }
    finally {
      loading.value = false;
    }
  }

  async function encrypt(text: string): Promise<string> {
    const key = await ensureKey();

    return encryptWithRSA(text, key);
  }

  return {
    loading,
    encrypt,
  };
}
