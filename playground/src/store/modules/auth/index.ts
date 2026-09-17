import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { SetupStoreId } from '@/enum';
import { useRSA } from '@/hooks/common/crypto';
import { useRouterPush } from '@/hooks/common/router';
import { fetchChangePassword, fetchCurrentUser, fetchLogin, fetchRegister } from '@/service/api';
import { localStg } from '@/utils/storage';
import { clearAuthStorage, getToken } from './shared';

/** 用户认证与登录信息状态。 */
export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { encrypt } = useRSA();

  const token = ref('');
  const userInfo = reactive<Api.Auth.UserResponse>({
    id: 0,
    username: '',
    role: 'user',
    status: 'active',
    created_at: '',
  });

  const isLogin = computed(() => Boolean(token.value));

  async function login(username: string, password: string) {
    const encryptedPassword = await encrypt(password);
    const { data, error } = await fetchLogin({
      username,
      password: encryptedPassword,
    });

    if (!error && data) {
      localStg.token.value = data.token;
      token.value = data.token;
      Object.assign(userInfo, data.user);
      await redirectFromLogin();
      return true;
    }

    return false;
  }

  async function register(username: string, password: string) {
    const encryptedPassword = await encrypt(password);
    const { error } = await fetchRegister({
      username,
      password: encryptedPassword,
    });

    return !error;
  }

  async function getUserInfo() {
    const { data, error } = await fetchCurrentUser();

    if (!error && data) {
      Object.assign(userInfo, data);
      return true;
    }

    return false;
  }

  async function initUserInfo() {
    const maybeToken = getToken();

    if (maybeToken) {
      token.value = maybeToken;
      await getUserInfo();
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    const encryptedOldPassword = await encrypt(oldPassword);
    const encryptedNewPassword = await encrypt(newPassword);
    const { error } = await fetchChangePassword({
      old_password: encryptedOldPassword,
      new_password: encryptedNewPassword,
    });

    return !error;
  }

  async function resetStore() {
    clearAuthStorage();
    token.value = '';
    Object.assign(userInfo, {
      id: 0,
      username: '',
      role: 'user',
      status: 'active',
      created_at: '',
    });
    await toLogin();
  }

  return {
    token,
    userInfo,
    isLogin,
    login,
    register,
    getUserInfo,
    changePassword,
    initUserInfo,
    resetStore,
  };
});
