export const getCookie = (name) => {
    //쿠키에 있는 jwt 토큰 꺼내옴
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
};

export const checkLoginStatus = () => {
    const token = getCookie('jwt_token');
    return !!token; // JWT 토큰이 있으면 true
};