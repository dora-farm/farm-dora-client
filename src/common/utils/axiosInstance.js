import axios from 'axios';
import { getCookie } from './Cookies';

const instance = axios.create({
  baseURL: import.meta.env.VITE_ACTIVITY_REST_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = getCookie('jwt_token'); // 쿠키에서 자동으로 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;