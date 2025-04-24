import { useEffect, useState } from 'react';
import {getCookie} from "../../../common/utils/Cookies.jsx";

export const useLogin = () => {
    const [id, setId] = useState('');
    const [saveIdChecked, setSaveIdChecked] = useState(false);

    useEffect(() => {
        const idCookie = getCookie('username');
        if (idCookie) {
            setId(idCookie);
            setSaveIdChecked(true);
        }
    }, []);

    return {
        id,
        setId,
        saveIdChecked,
        setSaveIdChecked,
    };
};