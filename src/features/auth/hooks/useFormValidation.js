import { useState } from 'react';

const useFormValidation = () => {
    const [formValid, setFormValid] = useState({
        name: false,
        id: false,
        pwd: false,
        password_confirmation: false,
        email: true,
        email_verified: false,
    });

    return [formValid, setFormValid];
};

export default useFormValidation;