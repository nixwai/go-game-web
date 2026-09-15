import type { ProviderDialogOpenOptions, ProviderFormModel } from '../typings';
import { ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';

export function useProviderSubmit() {
  const aiStore = useAIStore();
  const loading = ref(false);
  const dialogVisible = ref(false);
  const formMode = ref<'create' | 'edit'>('create');
  const formModel = ref<ProviderFormModel>(createDefaultFormModel());

  function createDefaultFormModel(): ProviderFormModel {
    return { provider_name: '', base_url: '', apiKey: '' };
  }

  function resetForm() {
    formMode.value = 'create';
    formModel.value = createDefaultFormModel();
  }

  function open(options: ProviderDialogOpenOptions = {}) {
    resetForm();

    if (options.mode === 'edit') {
      formMode.value = 'edit';
      formModel.value = {
        id: options.row.id,
        provider_name: options.row.provider_name,
        base_url: options.row.base_url,
        apiKey: '',
      };
    }

    dialogVisible.value = true;
  }

  function close() {
    dialogVisible.value = false;
    resetForm();
  }

  async function handleSubmit() {
    const data = { ...formModel.value };
    loading.value = true;

    try {
      if (formMode.value === 'create') {
        return await aiStore.createProvider({
          provider_name: data.provider_name,
          base_url: data.base_url,
          apiKey: data.apiKey,
        });
      }

      return await aiStore.updateProvider({
        id: data.id!,
        provider_name: data.provider_name,
        base_url: data.base_url,
        apiKey: data.apiKey,
      });
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
    open,
    close,
    handleSubmit,
  };
}
