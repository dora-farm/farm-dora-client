import axios from "axios";
import {getCookie} from "../../../common/utils/Cookies.jsx";

export const userPasswordCheck = async (pwd) => {
    const token = getCookie("jwt_token");
    return await axios.post(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/verify`,{ pwd :pwd}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getUserInfo = async () => {
    const token = getCookie("jwt_token");
    return await axios.get(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/detail`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateProfile = async (dto) => {
    const token = getCookie("jwt_token");
    return await axios.put(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/modify`, dto, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const expireUser  = async (pwd) => {
    const token = getCookie("jwt_token");
    return await axios.put(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/expire`,{ pwd :pwd},{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};