import axios from "../../../common/utils/axiosInstance.js";

export const userPasswordCheck = async (pwd) => {
    return await axios.post(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/verify`,{ pwd :pwd}, {
    });
};

export const getUserInfo = async () => {
    return await axios.get(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/detail`,{
    });
};

export const updateProfile = async (dto) => {
    return await axios.put(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/modify`, dto, {
    });
};

export const expireUser  = async (pwd) => {
    return await axios.put(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/update/expire`,{ pwd :pwd},{
    });
};