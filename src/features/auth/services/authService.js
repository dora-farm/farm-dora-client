import { fetchWithAuth } from '../../../common/utils/fetchWithAuth';

export const registerSocial = async (provider) => {
    await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/oauth/id/save`, {
        method: "POST",
        body: JSON.stringify({ provider }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.data);
            window.location.href = data.data;
        })
        .catch((err) => {
            console.error("Login Error:", err);
        });
};

export const loginSocial = async (provider) => {
    window.location.href = `${import.meta.env.VITE_AUTH_REST_API_URL}/oauth2/authorization/${provider}`;
};

export const loginUser = async (id, saveIdChecked, setModalMessage, setShowModal, setModalTitle) => {
    const loginFormData = new FormData();
    loginFormData.append('id', id);
    loginFormData.append('pwd', document.getElementById('pwd').value);

    try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_REST_API_URL}/login`, {
            method: 'POST',
            body: loginFormData,
            credentials: 'include', // 중요! 쿠키 자동 저장/전송
        });

        const data = await response.json();

        console.log(data.message);

        if (!response.ok) {
            setModalTitle('실패');
            setModalMessage(data.message || '로그인 실패');
            setShowModal(true);
            return;
        }

        // ID 저장 여부 처리 (별도 쿠키)
        if (saveIdChecked) {
            document.cookie = `username=${id}; path=/; SameSite=Lax;`;
        } else {
            document.cookie = `username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        }

    window.location.href = "/";

    } catch (error) {
        console.error('로그인 요청 오류:', error);
        setModalTitle('실패');
        setModalMessage('서버 요청 중 오류 발생');
        setShowModal(true);
    }
};

export const logoutUser = async () => {
    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/login/logout`, {
            method: 'POST',
        });

        const result = await response.json();

        if (result.status === 200) {
            console.log(result.message);
        }
    } catch (error) {
        console.error("로그아웃 중 오류 발생", error);
    }
    window.location.href = "/";
};