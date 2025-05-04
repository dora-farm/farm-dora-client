import { fetchWithAuth } from '../../../common/utils/fetchWithAuth';

export const registerSocial = async (provider) => {
    await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/oauth/id/save`, {
        method: "POST",
        body: JSON.stringify({ provider }),
    })
        .then((res) => res.json())
        .then((data) => {
            alert(data.data);
            window.location.href = data.data;
        })
        .catch((err) => {
            console.error("Login Error:", err);
            alert("로그인 실패");
        });
};

export const loginSocial = async (provider) => {
    window.location.href = `${import.meta.env.VITE_AUTH_REST_API_URL}/oauth2/authorization/${provider}`;
};

export const loginUser = async (id, saveIdChecked, setModalMessage, setShowModal) => {
    const loginFormData = new FormData();
    loginFormData.append('id', id);
    loginFormData.append('pwd', document.getElementById('pwd').value);

    const response = await fetch(`${import.meta.env.VITE_AUTH_REST_API_URL}/login`, {
        method: 'POST',
        body: loginFormData,
    });

    const data = await response.json();

    if (!response.ok) {
        setModalMessage(data.message || '로그인 실패');
        setShowModal(true);
        return;
    }

    document.cookie = `jwt_token=${data.accessToken}; path=/; domain=localhost; SameSite=Lax;`;

    if (saveIdChecked) {
        document.cookie = `username=${id}; path=/; domain=localhost; SameSite=Lax;`;
    } else {
        document.cookie = `username=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }

    window.location.href = "/";
};

export const logoutUser = async () => {
    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/login/logout`, {
            method: 'POST',
        });

        const result = await response.json();

        if (result.status === 200) {
            console.log(result.message);

            document.cookie = "jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
    } catch (error) {
        console.error("로그아웃 중 오류 발생", error);
        alert("서버 오류로 로그아웃에 실패했습니다.");
    }
    window.location.href = "/";
};