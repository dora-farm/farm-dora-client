import { useState } from 'react';

const useFormValidation = () => {
    const [formValid, setFormValid] = useState({
        name: false,
        id: false,
        pwd: false,
        password_confirmation: false,
        email: false,
        email_verified: false,
        postNum:false,
        addr: false,
        detailAddr: false,
        phoneNum: false,
        accountNum: false,
        birth: false,
        sex: false,
    });

    return [formValid, setFormValid];
};

export default useFormValidation;