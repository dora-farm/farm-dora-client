import axios from 'axios';
import {getCookie} from "../../../common/utils/Cookies.jsx";

const BASE_URL = `${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/depot`;

export const fetchAddresses = async () => {
    const token = getCookie('jwt_token');
    const response = await axios.get(`${BASE_URL}/all`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const getUserAddress = async () => {
    const token = getCookie('jwt_token');
    const response = await axios.get(`${BASE_URL}/user/address`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
}

export const createAddress = async (data) => {
    const token = getCookie('jwt_token');
    const response = await axios.post(`${BASE_URL}/register`, data,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const detailAddress = async (depotId) => {
    const token = getCookie('jwt_token');
    const response = await axios.get(`${BASE_URL}/detail/${depotId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const updateAddress = async (data) => {
    const token = getCookie('jwt_token');
    const response = await axios.put(`${BASE_URL}/modify`, data,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteAddress = async (depotId) => {
    const token = getCookie('jwt_token');
    const response = await axios.delete(`${BASE_URL}/delete/${depotId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
