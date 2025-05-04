export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];

    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload);

  } catch (error) {
    console.error('토큰 디코딩 오류: ',error);
    return null;
  }
};