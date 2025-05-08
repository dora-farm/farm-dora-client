import axios from "../../../common/utils/axiosInstance.js";

export const userPasswordCheck = async (pwd) => {
    return await axios.post(`${import.meta.env.VITE_AUTH_REST_API_URL}/mypage/user/verify`,{ pwd :pwd}, {
    });
};

export const getUserInfo = async () => {
    return await axios.get(`${import.meta.env.VITE_AUTH_REST_API_URL}/mypage/user/detail`,{
    });
};

export const updateProfile = async (dto) => {
    return await axios.put(`${import.meta.env.VITE_AUTH_REST_API_URL}/mypage/user/modify`, dto, {
    });
};

export const expireUser  = async (pwd) => {
    return await axios.put(`${import.meta.env.VITE_AUTH_REST_API_URL}/mypage/user/expire`,{ pwd :pwd},{
    });
};