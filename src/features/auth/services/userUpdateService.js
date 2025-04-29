import axios from "axios";

export const userPasswordCheck = async (pwd) => {
    return await axios.post('http://localhost:8080/api/mypage/user/update/verify',{ pwd :pwd}, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export const getUserInfo = async () => {
    return await axios.get('http://localhost:8080/api/mypage/user/update/detail',{
        withCredentials: true
    });
};

export const updateProfile = async (dto) => {
    return await axios.put('http://localhost:8080/api/mypage/user/update/modify', dto, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const blindUser = async () => {

};
