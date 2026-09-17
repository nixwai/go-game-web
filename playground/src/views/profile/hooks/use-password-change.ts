import type { PasswordChangeFormModel } from '../typings';
import { ref } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { validatePasswordChangeForm } from '../config/rules';

/** 管理修改密码的提交状态与业务流程。 */
export function usePasswordChange() {
  const authStore = useAuthStore();
  const loading = ref(false);
  const errorMsg = ref('');
  const successMsg = ref('');

  /** 校验并提交密码修改，返回是否修改成功。 */
  async function handleSubmit(formData: PasswordChangeFormModel): Promise<boolean> {
    if (loading.value) {
      return false;
    }

    errorMsg.value = '';
    successMsg.value = '';
    const errors = validatePasswordChangeForm(formData);
    const firstError = Object.values(errors)[0];

    if (firstError) {
      errorMsg.value = firstError;
      return false;
    }

    loading.value = true;

    try {
      const success = await authStore.changePassword(formData.oldPassword, formData.newPassword);

      if (success) {
        successMsg.value = '密码修改成功';
        return true;
      }

      errorMsg.value = '修改失败，请检查原密码和新密码';
      return false;
    }
    catch {
      errorMsg.value = '修改失败，请稍后重试';
      return false;
    }
    finally {
      loading.value = false;
    }
  }

  return {
    loading,
    errorMsg,
    successMsg,
    handleSubmit,
  };
}
