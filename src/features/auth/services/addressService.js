import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/mypage/user/depot';

export const fetchAddresses = async (userId) => {
    const response = await axios.get(`${BASE_URL}/all/${userId}`);
    return response.data.data;
};

export const createAddress = async (data) => {
    const response = await axios.post(`${BASE_URL}/register`, data);
    return response.data;
};

export const detailAddress = async (depotId) => {
    const response = await axios.get(`${BASE_URL}/detail/${depotId}`);
    console.log(response.data);
    return response.data.data;
};

export const updateAddress = async (data) => {
    const response = await axios.put(`${BASE_URL}/modify`, data);
    return response.data;
};

export const deleteAddress = async (depotId) => {
    const response = await axios.delete(`${BASE_URL}/delete/${depotId}`);
    return response.data;
};
