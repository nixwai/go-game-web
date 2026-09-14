import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestInstanceState } from './type';
import axios from 'axios';
import { reactive } from 'vue';
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

export const requestState = reactive<RequestInstanceState>({ errMsgStack: [], errorMessage: '' });

function toMessage(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getHttpErrorMessage(error: AxiosError<Api.Response>): string {
  const responseMessage = error.response?.data?.message;

  if (responseMessage) {
    return toMessage(responseMessage, '请求失败');
  }

  if (!error.response) {
    return error.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '网络异常，请检查网络连接';
  }

  const statusMessages: Record<number, string> = {
    400: '请求参数错误',
    401: '登录状态已失效，请重新登录',
    403: '没有权限执行此操作',
    404: '请求资源不存在',
    500: '服务器异常，请稍后重试',
  };

  return statusMessages[error.response.status] || '请求失败，请稍后重试';
}

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
    const payload = response.data;

    if (!payload || typeof payload.code !== 'number') {
      const message = '服务响应异常，请稍后重试';
      showErrorMsg(requestState, message);

      return Promise.reject(new Error(message));
    }

    const { code, message: responseMessage } = payload;
    const message = toMessage(responseMessage, '请求失败');

    if (code === BUSINESS_CODE.SUCCESS) {
      return response;
    }

    if (LOGOUT_CODES.includes(code)) {
      localStorage.removeItem('go_game_token');
      showErrorMsg(requestState, message === '请求失败' ? '令牌已失效，请重新登录' : message);

      if (window.location.pathname !== '/login') {
        const redirect = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        window.setTimeout(() => {
          window.location.href = redirect;
        }, 800);
      }

      return Promise.reject(new Error(message));
    }

    showErrorMsg(requestState, message);

    return Promise.reject(new Error(message));
  },
  (error: AxiosError<Api.Response>) => {
    showErrorMsg(requestState, getHttpErrorMessage(error));

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
