import { ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';

export function useProviderDelete(callback: () => Promise<void>) {
  const aiStore = useAIStore();
  const deletingId = ref<number | null>(null);

  async function handleDelete(id: number) {
    if (id === 0) {
      return;
    }
    deletingId.value = id;
    try {
      const success = await aiStore.deleteProvider(id);
      if (success) {
        await callback();
      }
    }
    finally {
      deletingId.value = null;
    }
  }

  return {
    deletingId,
    handleDelete,
  };
}
