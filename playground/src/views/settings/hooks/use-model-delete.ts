import { ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';

export function useModelDelete(getTableData: () => Promise<void>) {
  const aiStore = useAIStore();
  const deletingId = ref<number | null>(null);

  async function handleDelete(id: number) {
    if (id === 0) {
      return;
    }
    deletingId.value = id;
    try {
      const success = await aiStore.deleteModel(id);
      if (success) {
        await getTableData();
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
