import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { SetupStoreId } from '@/enum';
import { useRSA } from '@/hooks/common/crypto';
import {
  fetchCreateModel,
  fetchCreateProvider,
  fetchDeleteModel,
  fetchDeleteProvider,
  fetchProviderList,
  fetchUpdateModel,
  fetchUpdateProvider,
} from '@/service/api';

export const useAIStore = defineStore(SetupStoreId.Ai, () => {
  const { encrypt } = useRSA();

  const providers = ref<Api.Ai.ProviderResponse[]>([]);
  const loading = ref(false);

  const activeModels = computed<Api.Ai.ModelOption[]>(() => {
    const models: Api.Ai.ModelOption[] = [];

    for (const provider of providers.value) {
      if (provider.status !== 'active') {
        continue;
      }

      for (const model of provider.models) {
        if (model.status !== 'active') {
          continue;
        }

        models.push({
          id: model.id,
          model_name: model.model_name,
          provider_id: provider.id,
          provider_name: provider.provider_name,
          is_default: model.is_default,
          has_api_key: provider.has_api_key,
        });
      }
    }

    return models;
  });

  const defaultModel = computed(() => activeModels.value.find(m => m.is_default) ?? null);

  async function fetchProviders() {
    loading.value = true;

    try {
      const { data, error } = await fetchProviderList();

      if (!error && data) {
        providers.value = data;
      }
    }
    finally {
      loading.value = false;
    }
  }

  async function createProvider(data: {
    provider_name: string
    base_url: string
    apiKey: string
  }) {
    const encryptedKey = await encrypt(data.apiKey);
    const { error } = await fetchCreateProvider({
      provider_name: data.provider_name,
      base_url: data.base_url,
      encrypted_api_key: encryptedKey,
    });

    if (!error) {
      await fetchProviders();
    }

    return !error;
  }

  async function updateProvider(data: {
    id: number
    provider_name?: string
    base_url?: string
    apiKey?: string
    status?: 'active' | 'disabled'
  }) {
    let encryptedKey: string | undefined;

    if (data.apiKey) {
      encryptedKey = await encrypt(data.apiKey);
    }

    const { error } = await fetchUpdateProvider({
      id: data.id,
      provider_name: data.provider_name,
      base_url: data.base_url,
      encrypted_api_key: encryptedKey,
      status: data.status,
    });

    if (!error) {
      await fetchProviders();
    }

    return !error;
  }

  async function deleteProvider(id: number) {
    const { error } = await fetchDeleteProvider({ id });

    if (!error) {
      await fetchProviders();
    }

    return !error;
  }

  async function createModel(providerId: number, modelName: string) {
    const { error } = await fetchCreateModel({
      provider_id: providerId,
      model_name: modelName,
    });

    if (!error) {
      await fetchProviders();
    }

    return !error;
  }

  async function updateModel(id: number, data: { model_name?: string, status?: 'active' | 'disabled' }) {
    const { error } = await fetchUpdateModel({ id, ...data });

    if (!error) {
      await fetchProviders();
    }

    return !error;
  }

  async function deleteModel(id: number) {
    const { error } = await fetchDeleteModel({ id });

    if (!error) {
      await fetchProviders();
    }

    return !error;
  }

  return {
    providers,
    loading,
    activeModels,
    defaultModel,
    fetchProviders,
    createProvider,
    updateProvider,
    deleteProvider,
    createModel,
    updateModel,
    deleteModel,
  };
});
