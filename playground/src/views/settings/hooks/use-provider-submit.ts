import type { ProviderFormModel } from '../typings';
import { ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';

export function useProviderSubmit(getTableData: () => Promise<void>) {
  const aiStore = useAIStore();
  const loading = ref(false);
  const dialogVisible = ref(false);
  const formMode = ref<'create' | 'edit'>('create');
  const formModel = ref<ProviderFormModel>({
    provider_name: '',
    base_url: '',
    apiKey: '',
  });

  function openCreate() {
    formMode.value = 'create';
    formModel.value = { provider_name: '', base_url: '', apiKey: '' };
    dialogVisible.value = true;
  }

  function openEdit(row: Api.Ai.ProviderResponse) {
    formMode.value = 'edit';
    formModel.value = {
      id: row.id,
      provider_name: row.provider_name,
      base_url: row.base_url,
      apiKey: '',
    };
    dialogVisible.value = true;
  }

  async function handleSubmit(data: ProviderFormModel) {
    loading.value = true;
    try {
      let success = false;
      if (formMode.value === 'create') {
        success = await aiStore.createProvider({
          provider_name: data.provider_name,
          base_url: data.base_url,
          apiKey: data.apiKey,
        });
      }
      else {
        success = await aiStore.updateProvider({
          id: data.id!,
          provider_name: data.provider_name,
          base_url: data.base_url,
          apiKey: data.apiKey,
        });
      }
      if (success) {
        dialogVisible.value = false;
        await getTableData();
      }
    }
    finally {
      loading.value = false;
    }
  }

  return {
    loading,
    dialogVisible,
    formMode,
    formModel,
    openCreate,
    openEdit,
    handleSubmit,
  };
}
