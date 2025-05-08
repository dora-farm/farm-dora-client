import { fetchWithAuth } from '../../../common/utils/fetchWithAuth.js';

export const findId = async (name, email) => {
    console.log(name, email);
    const response = await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/find/send/code`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: name,
            email: email,
            id:null,
        }),
    });
    if (!response.ok) throw new Error("아이디 찾기 실패");
    return response.json();
};

export const findPassword = async (id, email) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/find/send/code`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            id: id,
            email: email,
            name:null,
        }),
    });
    if (!response.ok) throw new Error("비밀번호 찾기 실패");
    return response.json();
};

export const findVerificationCode = async (email, code, find) => {
    const response = await fetchWithAuth(`${import.meta.env.VITE_AUTH_REST_API_URL}/find/send/value`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email,
            code: code,
            find: find,
        }),
    });
    if (!response.ok) throw new Error("인증실패");
    return response.json();
}
