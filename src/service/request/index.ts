import { createRequest } from '@sa/axios';
import { clearAuthStorage } from '@/store/modules/auth/shared';
import { getServiceBaseURL } from '@/utils/service';
import { transformToCamelCase, transformToSnakeCase } from '@/utils/common';
import { getAuthorization, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL
  },
  {
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      config.data = transformToSnakeCase(config.data || {});
      config.params = transformToSnakeCase(config.params || {});

      return config;
    },
    isBackendSuccess(response) {
      return response.data.code === 0;
    },
    transformBackendResponse(response) {
      return transformToCamelCase(response.data.data);
    },
    // async onBackendFail(response) {
    //   window.$dialog?.error({
    //     title: $t('common.error'),
    //     content: response.data.message,
    //     positiveText: $t('common.confirm'),
    //     maskClosable: false,
    //     closeOnEsc: false
    //   });
    // },
    onError(error) {
      if (error.status === 401) {
        clearAuthStorage();
      }
      const message = error.response?.data.message || '网络错误';
      showErrorMsg(request.state, message);
    }
  }
);
