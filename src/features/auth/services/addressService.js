import axios from 'axios';
import {getCookie} from "../../../common/utils/Cookies.jsx";

const BASE_URL = 'http://localhost:8080/api/mypage/user/depot';
const token = getCookie('jwt_token');

export const fetchAddresses = async () => {
    const response = await axios.get(`${BASE_URL}/all`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const createAddress = async (data) => {
    const response = await axios.post(`${BASE_URL}/register`, data,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const detailAddress = async (depotId) => {
    const response = await axios.get(`${BASE_URL}/detail/${depotId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

export const updateAddress = async (data) => {
    const response = await axios.put(`${BASE_URL}/modify`, data,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteAddress = async (depotId) => {
    const response = await axios.delete(`${BASE_URL}/delete/${depotId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
