import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestInstanceState } from './type';
import axios from 'axios';
import { BUSINESS_CODE, LOGOUT_CODES } from '@/constants/app';
import { getAuthorization, showErrorMsg } from './shared';

interface FlatRequestResultData<T> {
  data: T | null
  error: unknown | null
}

const instance = axios.create({
  baseURL: '/',
  timeout: 150000,
});

export const requestState: RequestInstanceState = { errMsgStack: [] };

instance.interceptors.request.use(
  (config) => {
    const Authorization = getAuthorization();

    if (Authorization) {
      Object.assign(config.headers, { Authorization });
    }

    config.headers['X-Request-ID'] = crypto.randomUUID();

    return config;
  },
  error => Promise.reject(error),
);

instance.interceptors.response.use(
  (response: AxiosResponse<Api.Response>) => {
    const { code, message } = response.data;

    if (code === BUSINESS_CODE.SUCCESS) {
      return response;
    }

    if (LOGOUT_CODES.includes(code)) {
      localStorage.removeItem('go_game_token');
      showErrorMsg(requestState, message || '令牌已失效');

      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }

      return Promise.reject(new Error(message || '令牌已失效'));
    }

    showErrorMsg(requestState, message || '请求失败');

    return Promise.reject(new Error(message || '请求失败'));
  },
  (error) => {
    const message = error?.response?.data?.message || error?.message || '网络异常';

    showErrorMsg(requestState, message);

    return Promise.reject(error);
  },
);

async function flatRequest<T>(config: AxiosRequestConfig): Promise<FlatRequestResultData<T>> {
  try {
    const response = await instance(config);
    const data = response.data.data as T;

    return { data, error: null };
  }
  catch (error) {
    return { data: null, error };
  }
}

export const request = {
  get: <T>(config: AxiosRequestConfig) => flatRequest<T>({ ...config, method: 'get' }),
  post: <T>(config: AxiosRequestConfig) => flatRequest<T>({ ...config, method: 'post' }),
};
