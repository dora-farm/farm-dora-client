import React, {useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import useFormValidation from "../hooks/useFormValidation";
import DaumPostcode from 'react-daum-postcode';
import {
    focusSpan, blurSpan,
    validateName, validateId,
    validatePwd, confirmPwd,
    validateEmail, sendVerificationEmail,
    verifyEmailCode, phoneNumContainDash
} from "../services/validationService";
import AlertModal from "../../../common/components/modal/AlertModal.jsx";
import {useEmailVerifyModal} from "../hooks/useEmailVerifyModal.js";
import EmailVerifyModalForm from "./modal/EmailVerifyModalForm.jsx";

const JoinForm = () => {
    const [formValid, setFormValid] = useFormValidation();
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const findVerifyCodeRef = useRef('');

    const {
        isVerifyModal,
        title: verifyTitle,
        content: verifyContent,
        inputs: verifyInputs,
        onSubmitCode,
        openVerifyModal,
        closeVerifyModal,
    } = useEmailVerifyModal();

    const handleSendEmailCode = async () => {
        const result = await sendVerificationEmail();
        console.log(result.data);
        if (result.data) {
            openRegisterVerifyModal();
        }
    };


    const openRegisterVerifyModal = () => {
        openVerifyModal({
            modalTitle: "인증번호 입력",
            modalContent: "입력한 이메일로 발송된 인증번호를 입력하세요.",
            modalInputs: [
                { label: "인증코드", type: "text", name: "code", onChange: (e) => findVerifyCodeRef.current = e.target.value },
            ],
            onSubmit: async () => {
                try {
                    console.log(document.getElementById('email').value);
                    const result = await verifyEmailCode(document.getElementById('email').value, findVerifyCodeRef.current, setFormValid);
                    if(result.data){
                    setModalMessage(result.message);
                    setShowModal(true);
                    closeVerifyModal();
                    }else {
                        setModalMessage("인증에 실패하였습니다.");
                        setShowModal(true);
                    }
                } catch (err) {
                    console.error(err);
                    setModalMessage("인증에 실패하였습니다.");
                    setShowModal(true);
                }
            },
        });
    };

    // useEffect(() => {
    //     const verifyBtn = document.getElementById("emailVerifyBtn");
    //
    //     if (verifyBtn) {
    //         const handleVerifyClick = async () => {
    //             const code = document.getElementById("emailCodeInput").value;
    //             const email = document.getElementById("email").value;
    //             const result = await verifyEmailCode(email, code, setFormValid);
    //             setModalMessage(result.message);
    //             setShowModal(true);
    //         };
    //
    //         verifyBtn.addEventListener("click", handleVerifyClick);
    //
    //         // cleanup (메모리 누수 방지)
    //         return () => verifyBtn.removeEventListener("click", handleVerifyClick);
    //     }
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(formValid).some((v) => !v)) {
            setModalMessage("입력값을 확인해 주세요");
            setShowModal(true);
            return;
        }

        const form = document.querySelector("form");

        const formData = {
            name: form.name.value,
            id: form.id.value,
            email: form.email.value,
            pwd: form.pwd.value,
            phoneNum: form.phoneNum.value,
            authId: 3,
            accountNum: form.accountNum.value,
            birth: form.birth.value,
            sex: form.sex.value,
            bankId: form.bankId.value,
            address: {
                addr: form.addr.value,
                postNum: form.postNum.value,
                detailAddr: form.detailAddr.value,
            }
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_AUTH_REST_API_URL}/api/auth/register/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setModalMessage("회원가입이 완료되었습니다!");
                setShowModal(true);

                setTimeout(() => {
                    setShowModal(false);
                    navigate("/login"); // 회원가입 성공 후 로그인 페이지 이동
                }, 1500); // 1.5초 뒤 이동 (모달 보여주고)
            } else {
                setModalMessage(data.message || "회원가입에 실패했습니다.");
                setShowModal(true);
            }
        } catch (error) {
            console.error("회원가입 에러:", error);
            setModalMessage("서버 오류로 인해 실패했습니다.");
            setShowModal(true);
        }
    };

    const handleComplete = (data) => {
        document.getElementById("postNum").value = data.zonecode;
        document.getElementById("addr").value = data.address + (data.buildingName ? ` (${data.buildingName})` : '');
        setIsPostOpen(false);
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-white">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md w-1/2 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-9">회원정보입력</h2>

                {/* 이름 입력 */}
                <div className="flex flex-col px-2 py-1 border rounded-md border-gray-300">
                    <span id="nameSpan" className="p-1 text-xs font-normal text-[#8A8A8A]">이름</span>
                    <input id="name" name="name" type="text" className="p-1 w-full focus:outline-none"
                           onFocus={() => focusSpan("nameSpan", '이름 (공백 없이 한글 2-16자)')}
                           onBlur={() => blurSpan("nameSpan", '이름')}
                           onKeyUp={() => validateName(setFormValid)}
                    />
                </div>
                <span id="alertName" className="text-xs text-red-500" />

                {/* ID 입력 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300">
                    <span id="idSpan" className="p-1 text-xs font-normal text-[#8A8A8A]">ID</span>
                    <input id="id" name="id" type="text" className="p-1 w-full focus:outline-none"
                           onFocus={() => focusSpan("idSpan", 'ID (공백 없이 영/숫자 5-10 조합)')}
                           onBlur={() => blurSpan("idSpan", 'ID')}
                           onKeyUp={() => validateId(setFormValid)}
                    />
                </div>
                <span id="alertId" className="text-xs text-red-500" />

                {/* 비밀번호 입력 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300">
                    <span id="pwdSpan" className="p-1 text-xs font-normal text-[#8A8A8A]">비밀번호</span>
                    <input id="pwd" name="pwd" type="password" className="p-1 w-full focus:outline-none"
                           onFocus={() => focusSpan("pwdSpan", '비밀번호 (공백 없이 영/숫자 8-16 조합)')}
                           onBlur={() => blurSpan("pwdSpan", '비밀번호')}
                           onKeyUp={() => validatePwd(setFormValid)}
                    />
                    <span className="border-t p-1 text-xs font-normal text-[#8A8A8A]">비밀번호 확인</span>
                    <input id="confirm-password" type="password" className="p-1 w-full focus:outline-none"
                           onChange={() => confirmPwd(setFormValid)}
                    />
                </div>
                <span id="alertPwd" className="text-xs text-red-500" />

                {/* 휴대폰 번호 입력 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300">
                    <span className="p-1 text-xs font-normal text-[#8A8A8A]">휴대폰번호</span>
                    <input onChange={phoneNumContainDash} id="phoneNum" name="phoneNum" type="text" className="p-1 w-full focus:outline-none" />
                </div>

                {/* 이메일 입력 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300">
                    <span className="p-1 text-xs font-normal text-[#8A8A8A]">이메일</span>
                    <input id="email" name="email" type="email" className="p-1 w-full focus:outline-none"
                           onKeyUp={() => validateEmail(setFormValid)}
                    />
                    <button type="button" onClick={handleSendEmailCode} className="mt-2 bg-gray-200 text-xs rounded-md p-1 mb-2">
                        인증 메일 보내기
                    </button>
                </div>
                <span id="alertEmail" className="text-xs text-red-500" />

                {/* 주소 입력 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300 relative">
                    <span className="p-1 text-xs font-normal text-[#8A8A8A]">주소</span>
                    <button type="button" onClick={() => setIsPostOpen(true)} className="bg-gray-200 text-xs rounded-md p-1 mb-2">
                        주소 검색
                    </button>
                    <input id="postNum" name="postNum" type="text" className="p-1 w-full focus:outline-none mb-2" placeholder="우편번호" readOnly />
                    <input id="addr" name="addr" type="text" className="p-1 w-full focus:outline-none mb-2" placeholder="주소" readOnly />
                    <input id="detailAddr" name="detailAddr" type="text" className="p-1 w-full focus:outline-none" placeholder="상세주소" />
                    {isPostOpen && (
                        <div className="absolute z-50 mt-2 w-full bg-white border rounded shadow">
                            <DaumPostcode onComplete={handleComplete} autoClose />
                            <button type="button" onClick={() => setIsPostOpen(false)} className="w-full text-center text-sm py-1 border-t">
                                닫기
                            </button>
                        </div>
                    )}
                </div>

                {/* 은행 선택 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300">
                    <span className="p-1 text-xs font-normal text-[#8A8A8A]">은행</span>
                    <select id="bankId" name="bankId" className="p-1 w-full focus:outline-none">
                        <option value="1">신한은행</option>
                        <option value="2">국민은행</option>
                        <option value="3">우리은행</option>
                        <option value="4">하나은행</option>
                        <option value="5">농협은행</option>
                        <option value="6">카카오뱅크</option>
                        <option value="7">토스뱅크</option>
                    </select>
                    <span className="p-1 text-xs font-normal text-[#8A8A8A]">계좌번호</span>
                    <input id="accountNum" name="accountNum" type="text" className="p-1 w-full focus:outline-none" />
                </div>

                {/* 생일 입력 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300">
                    <span className="p-1 text-xs font-normal text-[#8A8A8A]">생일</span>
                    <input id="birth" name="birth" type="date" className="p-1 w-full focus:outline-none" />
                </div>

                {/* 성별 선택 */}
                <div className="flex flex-col px-2 py-1 mt-4 border rounded-md border-gray-300">
                    <span className="p-1 text-xs font-normal text-[#8A8A8A]">성별</span>
                    <div className="flex space-x-8 mt-2">
                        <label><input type="radio" name="sex" value="MALE" /> 남성</label>
                        <label><input type="radio" name="sex" value="FEMALE" /> 여성</label>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-between mt-6">
                    <button type="submit" className="bg-green text-white py-2 px-8 rounded-md">회원가입</button>
                    <button type="button" onClick={() => navigate("/login")} className="border py-2 px-8 rounded-md">
                        이전으로
                    </button>
                </div>
            </form>

            {/* 이메일 인증 모달 */}
            <EmailVerifyModalForm
                title={verifyTitle}
                content={verifyContent}
                isOpen={isVerifyModal}
                onClose={closeVerifyModal}
                onSubmit={onSubmitCode}
                inputs={verifyInputs}
            />

            {/* Alert 모달 */}
            {showModal && (
                <AlertModal
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default JoinForm;
