import type { ModelDialogOpenOptions, ModelFormModel } from '../typings';
import { ref } from 'vue';
import { useAIStore } from '@/store/modules/ai';

/** 管理 AI 模型表单弹窗的打开、关闭与提交。 */
export function useModelSubmit() {
  const aiStore = useAIStore();
  const loading = ref(false);
  const dialogVisible = ref(false);
  const formModel = ref<ModelFormModel>(createDefaultFormModel(0));
  const formMode = ref<'create' | 'edit'>('create');

  function createDefaultFormModel(providerId: number): ModelFormModel {
    return { provider_id: providerId, model_name: '' };
  }

  function resetForm() {
    formMode.value = 'create';
    formModel.value = createDefaultFormModel(0);
  }

  /** 打开弹窗并初始化表单。 */
  function open(options: ModelDialogOpenOptions) {
    resetForm();
    formModel.value = { provider_id: options.providerId, model_name: '' };

    if (options.mode === 'edit') {
      formMode.value = 'edit';
      formModel.value = {
        id: options.row.id,
        provider_id: options.providerId,
        model_name: options.row.model_name,
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
        return await aiStore.createModel(data.provider_id, data.model_name);
      }

      return await aiStore.updateModel(data.id!, { model_name: data.model_name });
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
