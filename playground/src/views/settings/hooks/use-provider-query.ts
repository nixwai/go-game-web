import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';

export function useProviderQuery() {
  const aiStore = useAIStore();
  const { providers } = storeToRefs(aiStore);
  const loading = ref(false);

  async function getTableData() {
    loading.value = true;
    try {
      await aiStore.fetchProviders();
    }
    finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getTableData();
  });

  return {
    loading,
    providers,
    getTableData,
  };
}
