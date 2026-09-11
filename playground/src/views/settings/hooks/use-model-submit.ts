import type { ModelFormModel } from '../typings';
import { ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';

export function useModelSubmit(getTableData: () => Promise<void>) {
  const aiStore = useAIStore();
  const loading = ref(false);
  const dialogVisible = ref(false);
  const formModel = ref<ModelFormModel>({
    provider_id: 0,
    model_name: '',
  });
  const formMode = ref<'create' | 'edit'>('create');

  function openCreate(providerId: number) {
    formMode.value = 'create';
    formModel.value = { provider_id: providerId, model_name: '' };
    dialogVisible.value = true;
  }

  function openEdit(providerId: number, model: Api.Ai.ModelResponse) {
    formMode.value = 'edit';
    formModel.value = {
      id: model.id,
      provider_id: providerId,
      model_name: model.model_name,
    };
    dialogVisible.value = true;
  }

  async function handleSubmit(data: ModelFormModel) {
    loading.value = true;
    try {
      let success = false;
      if (formMode.value === 'create') {
        success = await aiStore.createModel(data.provider_id, data.model_name);
      }
      else {
        success = await aiStore.updateModel(data.id!, { model_name: data.model_name });
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
