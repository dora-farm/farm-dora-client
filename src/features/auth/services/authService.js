export const registerSocial = async (provider) => {
    alert("소셜연동");
    await fetch("http://localhost:8080/oauth/id/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
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
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
};

export const loginUser = async (id, saveIdChecked, setModalMessage, setShowModal) => {
    const loginFormData = new FormData();
    loginFormData.append('id', id);
    loginFormData.append('pwd', document.getElementById('pwd').value);

    const response = await fetch('http://localhost:8080/login', {
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

    window.location.href = '/';
};