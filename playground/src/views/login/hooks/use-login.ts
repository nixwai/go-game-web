import { reactive, ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useAuthStore } from '@/store/modules/auth';
import { validateForm } from '../config/rules';

export function useLogin() {
  const authStore = useAuthStore();
  const { redirectFromLogin, toRegister } = useRouterPush();
  const loading = ref(false);
  const errorMsg = ref('');

  const model = reactive({
    username: '',
    password: '',
  });

  async function handleSubmit(formData: { username: string, password: string }) {
    Object.assign(model, formData);
    errorMsg.value = '';
    const errors = validateForm(model);
    if (Object.keys(errors).length > 0) {
      errorMsg.value = Object.values(errors)[0];
      return;
    }

    loading.value = true;

    try {
      const success = await authStore.login(model.username, model.password);

      if (success) {
        await redirectFromLogin();
      }
      else {
        errorMsg.value = '登录失败，请检查用户名和密码';
      }
    }
    catch {
      errorMsg.value = '登录失败，请稍后重试';
    }
    finally {
      loading.value = false;
    }
  }

  return {
    model,
    loading,
    errorMsg,
    handleSubmit,
    toRegister,
  };
}
