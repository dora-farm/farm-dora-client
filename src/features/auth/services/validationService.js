import { fetchWithAuth } from '../../../common/utils/fetchWithAuth.js';

export const focusSpan = (id, message) => {
    const span = document.getElementById(id);
    span.innerText = message;
    span.className = span.className.replace('font-normal', 'font-bold');
};

export const blurSpan = (id, message) => {
    const span = document.getElementById(id);
    span.innerText = message;
    span.className = span.className.replace('font-bold', 'font-normal');
};

export const validateName = (setValid) => {
    const name = document.getElementById("name").value;
    const valid = /^[가-힣]{2,16}$/.test(name);
    document.getElementById("alertName").innerText = valid ? '' : '사용 불가능한 이름입니다.';
    setValid((prev) => ({ ...prev, name: valid }));
};

export const validateId = async (setValid) => {
    const id = document.getElementById("id").value;
    const valid = /^[a-z0-9]{5,10}$/.test(id);
    if (!valid) {
        document.getElementById("alertId").className = 'text-red-500 text-xs';
        document.getElementById("alertId").innerText = '사용 불가능한 아이디 입니다.';
        setValid((prev) => ({ ...prev, id: false }));
        return;
    }

    const res = await fetch(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/auth/register/idcheck?id=${id}`);
    const result = await res.json();
    const isAvailable = result.status !== 409;
    const alertId = document.getElementById("alertId");
    alertId.innerText = isAvailable ? '사용 가능한 아이디입니다.' : '이미 존재하는 아이디입니다.';
    alertId.className = isAvailable ? 'text-green-700 text-xs' : 'text-red-500 text-xs';

    setValid((prev) => ({ ...prev, id: isAvailable }));
};

export const validatePwd = (setValid) => {
    const pwd = document.getElementById("pwd").value;
    const confirm = document.getElementById("confirm-password").value;
    const valid = /^(?=.*[a-zA-Z]{4,})(?=.*[0-9]{1,})[a-zA-Z0-9]{8,16}$/.test(pwd);
    document.getElementById("alertPwd").innerText = valid ? '' : '사용 불가능한 비밀번호 입니다.';
    setValid((prev) => ({ ...prev, pwd: valid }));

    const match = pwd === confirm;
    document.getElementById("alertPwd").innerText = match ? '' : '비밀번호가 다릅니다';
    setValid((prev) => ({ ...prev, password_confirmation: match }));

    if(!valid){
        document.getElementById("alertPwd").innerText = '사용 불가능한 비밀번호 입니다.';
    }
};

export const validateEmail = async (setValid) => {
    const email = document.getElementById("email").value;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
        document.getElementById("alertEmail").className = 'text-red-500 text-xs';
        document.getElementById("alertEmail").innerText = '잘못된 이메일 형식입니다.';
        setValid((prev) => ({ ...prev, email: false }));
        return;
    }

    const res = await fetch(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/auth/register/emailcheck?email=${email}`);
    const result = await res.json();
    const available = result.status !== 409;
    const alertEmail = document.getElementById("alertEmail");
    alertEmail.innerText = available ? '사용 가능한 이메일입니다.' : '이미 존재하는 이메일입니다.';
    alertEmail.className = available ? 'text-green-700 text-xs' : 'text-red-500 text-xs';
    setValid((prev) => ({ ...prev, email: available }));
};

export const sendVerificationEmail = async () => {
    const email = document.getElementById("email").value;
    const res = await fetch(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/auth/register/send/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if(!res.ok) {throw new Error("서버와 연결 실패");}
    return await res.json();
};

export const verifyEmailCode = async (email, code, setValid) => {
    const res = await fetch(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/auth/register/verify/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
    });
    const result = await res.json();
    if (result.data) {
        // alert("이메일 인증 성공!");
        setValid((prev) => ({ ...prev, email_verified: true }));
        return result;
    } else {
        return result;
    }
};

export const formatPhoneNumber = (value, setValid) => {
    const onlyNums = value.replace(/[^\d]/g, '');
    let formatted = '';

    if (onlyNums.startsWith('02')) {
        if (onlyNums.length <= 2) formatted = onlyNums;
        else if (onlyNums.length <= 5) formatted = onlyNums.slice(0, 2) + '-' + onlyNums.slice(2);
        else if (onlyNums.length <= 9) formatted = onlyNums.slice(0, 2) + '-' + onlyNums.slice(2, 5) + '-' + onlyNums.slice(5);
        else formatted = onlyNums.slice(0, 2) + '-' + onlyNums.slice(2, 6) + '-' + onlyNums.slice(6, 10);

        if (onlyNums.length === 9 || onlyNums.length === 10) {
            setValid((prev) => ({ ...prev, phoneNum: true }));
        } else {
            setValid((prev) => ({ ...prev, phoneNum: false }));
        }
    } else {
        if (onlyNums.length <= 3) formatted = onlyNums;
        else if (onlyNums.length <= 6) formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
        else if (onlyNums.length <= 10) formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 6) + '-' + onlyNums.slice(6);
        else formatted = onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7, 11);

        if (onlyNums.length === 10 || onlyNums.length === 11) {
            setValid((prev) => ({ ...prev, phoneNum: true }));
        } else {
            setValid((prev) => ({ ...prev, phoneNum: false }));
        }
    }

    return formatted;
};

export const validateAccountNumber = (value, setFormValid) => {
    const onlyNums = value.replace(/[^\d]/g, '');
    const isValid = onlyNums.length >= 10 && onlyNums.length <= 14;

    if(isValid){
    setFormValid(prev => ({ ...prev, accountNum: isValid }));
    }else {
        setFormValid(prev => ({ ...prev, accountNum: false }));
    }
    return onlyNums; // 숫자만 반환 (폼 입력에 사용할 경우)
};

export const phoneNumContainDash = (e, setValid) => {
    e.target.value = formatPhoneNumber(e.target.value, setValid);
}

export const handleAccountNumberChange = (e, setValid) => {
    e.target.value = validateAccountNumber(e.target.value, setValid);
}