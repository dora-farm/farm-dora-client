import { useState } from 'react';

const useFormValidation = () => {
    const [formValid, setFormValid] = useState({
        name: false,
        id: false,
        pwd: false,
        password_confirmation: false,
        email: false,
        email_verified: false,
        phoneNum: false,
        accountNum: false,
        birth: false,
        sex: false,
    });

    return [formValid, setFormValid];
};

export default useFormValidation;