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
    const valid = /^(?=.*[a-z]{4,})(?=.*[0-9]{1,})[a-z0-9]{5,10}$/.test(id);
    if (!valid) {
        document.getElementById("alertId").className = 'text-red-500 text-xs';
        document.getElementById("alertId").innerText = '사용 불가능한 아이디 입니다.';
        setValid((prev) => ({ ...prev, id: false }));
        return;
    }
    const res = await fetch(`http://localhost:8080/api/auth/register/idcheck?id=${id}`);
    const result = await res.json();
    const isAvailable = result.status !== 409;
    const alertId = document.getElementById("alertId");
    alertId.innerText = isAvailable ? '사용 가능한 아이디입니다.' : '이미 존재하는 아이디입니다.';
    alertId.className = isAvailable ? 'text-green-700 text-xs' : 'text-red-500 text-xs';

    setValid((prev) => ({ ...prev, id: isAvailable }));
};

export const validatePwd = (setValid) => {
    const pwd = document.getElementById("pwd").value;
    const valid = /^(?=.*[a-zA-Z]{4,})(?=.*[0-9]{1,})[a-zA-Z0-9]{8,16}$/.test(pwd);
    document.getElementById("alertPwd").innerText = valid ? '' : '사용 불가능한 비밀번호 입니다.';
    setValid((prev) => ({ ...prev, pwd: valid }));
};

export const confirmPwd = (setValid) => {
    const pwd = document.getElementById("pwd").value;
    const confirm = document.getElementById("confirm-password").value;
    const match = pwd === confirm;
    document.getElementById("alertPwd").innerText = match ? '' : '비밀번호가 다릅니다';
    setValid((prev) => ({ ...prev, password_confirmation: match }));
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
    const res = await fetch(`http://localhost:8080/api/auth/register/emailcheck?email=${email}`);
    const result = await res.json();
    const available = result.status !== 409;
    const alertEmail = document.getElementById("alertEmail");
    alertEmail.innerText = available ? '사용 가능한 이메일입니다.' : '이미 존재하는 이메일입니다.';
    alertEmail.className = available ? 'text-green-700 text-xs' : 'text-red-500 text-xs';
    setValid((prev) => ({ ...prev, email: available }));
};

export const sendVerificationEmail = async (setValid) => {
    const email = document.getElementById("email").value;
    const res = await fetch(`http://localhost:8080/api/auth/register/send/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const result = await res.json();
    if (result.data) {
        document.getElementById("emailModal").classList.remove("hidden");
        return result;
    // } else {
    //     alert("인증 메일 보내기 실패");
    }
    setValid((prev) => ({ ...prev, email_verified: result.data }));
};

export const verifyEmailCode = async (email, code, setValid) => {
    const res = await fetch(`http://localhost:8080/api/auth/register/verify/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
    });
    const result = await res.json();
    if (result.data) {
        // alert("이메일 인증 성공!");
        document.getElementById("emailModal").classList.add("hidden");
        setValid((prev) => ({ ...prev, email_verified: true }));
        document.getElementById("emailCodeInput").value = '';
        return result;
    } else {
        document.getElementById("emailCodeInput").value = '';
        return result;
    }
};

const formatPhoneNumber = (value) => {
    // 숫자만 남기기
    const onlyNums = value.replace(/[^\d]/g, '');

    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 7) return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 7) + '-' + onlyNums.slice(7, 11);
};

export const phoneNumContainDash = (e) => {
    e.target.value = formatPhoneNumber(e.target.value);
}