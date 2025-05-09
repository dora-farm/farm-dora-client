import { getCookie } from './Cookies';

export const fetchWithAuthConvert = async (url, options = {}) => {
  const token = getCookie('jwt_token');
  
  // 기본 헤더 설정
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  // FormData가 아닌 경우에만 Content-Type 설정
  // JSON 데이터를 보낼 때는 Content-Type 헤더를 설정해야 함
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    if (typeof options.body === 'object') {
      headers['Content-Type'] = 'application/json';
      // JSON 문자열로 변환 (문자열이 아닌 경우에만)
      if (typeof options.body !== 'string') {
        options = {
          ...options,
          body: JSON.stringify(options.body)
        };
      }
    }
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
};