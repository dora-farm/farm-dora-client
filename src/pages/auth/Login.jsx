import React, {useEffect, useState} from 'react';
import { useLogin } from '../../features/auth/hooks/useLogin.js';
import {loginUser as loginUserService, loginSocial} from '../../features/auth/services/authService.js';
import LoginForm from "../../features/auth/components/LoginForm.jsx";
import SocialLoginButton from "../../features/auth/components/SocialLoginForm.jsx";
import {useLocation} from "react-router-dom";
import AlertModal2 from "../../common/components/modal/AlertModal2.jsx";

const Login = () => {
    const { id, setId, saveIdChecked, setSaveIdChecked } = useLogin();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMessage = params.get("error");
        if (errorMessage === "oauthlogin") {
            setModalTitle("실패");
            setModalMessage("로그인 후 마이페이지에서 연동해주세요");
            setShowModal(true);
        }else if (errorMessage === "fail") {
            setModalTitle("실패");
            setModalMessage("로그인 실패");
            setShowModal(true);
        }else if (errorMessage === "expired") {
            setModalTitle("실패");
            setModalMessage("회원 탈퇴된 계정입니다.")
            setShowModal(true);
        }else if (errorMessage === "blind") {
            setModalTitle("실패");
            setModalMessage("차단된 계정입니다.")
            setShowModal(true);
        }
    }, [location]);

    const loginUser = () => loginUserService(id, saveIdChecked, setModalMessage, setShowModal, setModalTitle);

    return (
        <div className="flex flex-col w-full items-center justify-center px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">로그인</h1>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 w-full max-w-5xl mb-3 items-center">
                {/* 로그인 폼 */}
                <LoginForm
                    id={id}
                    setId={setId}
                    saveIdChecked={saveIdChecked}
                    setSaveIdChecked={setSaveIdChecked}
                    loginUser={loginUser}
                />

                {/* 세로줄 */}
                <div className="hidden md:block w-px bg-gray-300 h-full"></div>

                {/* 소셜 로그인 버튼 */}
                <SocialLoginButton onLogin={loginSocial} title="간편 로그인" className="text-xl font-semibold text-center" />
            </div>
            {showModal && (
                <AlertModal2
                    title={modalTitle}
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Login;