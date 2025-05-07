import axios from '../../../common/utils/axiosInstance.js';

const BASE_URL = `${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/depot`;

export const fetchAddresses = async () => {
    const response = await axios.get(`${BASE_URL}/all`,{
    });
    return response.data.data;
};

export const getUserAddress = async () => {
    const response = await axios.get(`${BASE_URL}/user/address`,{
    });
    return response.data.data;
}

export const createAddress = async (data) => {
    const response = await axios.post(`${BASE_URL}/register`, data,{
    });
    return response.data;
};

export const detailAddress = async (depotId) => {
    const response = await axios.get(`${BASE_URL}/detail/${depotId}`,{
    });
    return response.data.data;
};

export const updateAddress = async (data) => {
    const response = await axios.put(`${BASE_URL}/modify`, data,{
    });
    return response.data;
};

export const deleteAddress = async (depotId) => {
    const response = await axios.delete(`${BASE_URL}/delete/${depotId}`,{
    });
    return response.data;
};
