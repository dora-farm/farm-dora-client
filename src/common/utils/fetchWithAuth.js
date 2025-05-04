import { getCookie } from './Cookies'; // getCookie 함수 재사용

export const fetchWithAuth = async (url, options = {}) => {
  const token = getCookie('jwt_token');

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // 쿠키 사용을 위해 필요할 수 있음
  });
};