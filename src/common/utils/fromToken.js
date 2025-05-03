import {getCookie} from "./Cookies.jsx";
import {jwtDecode} from "jwt-decode";

export const getToken = (key) => {
    const token = getCookie('jwt_token');
    if (!token) {return null;}
        const decoded = jwtDecode(token);
        return decoded[key];
}