import axios from 'axios';
import { ElMessage } from 'element-plus';
import useUserStore from '@/store/modules/user';

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});

request.interceptors.request.use(config => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  return config;
});

request.interceptors.response.use(
  response => {
    // 成功的回调
    return response.data;
  },
  error => {
    // 错误的回调
    let message = '';
    const { status } = error.response;
    switch (status) {
      case 401:
        message = 'token已过期';
        break;
      case 403:
        message = '无权访问';
        break;
      case 404:
        message = '请求地址错误';
        break;
      case 500:
        message = '服务器错误';
        break;
      default:
        message = '网络出现问题';
        break;
    }
    ElMessage.error(message);
    return Promise.reject(error);
  },
);

export default request;
