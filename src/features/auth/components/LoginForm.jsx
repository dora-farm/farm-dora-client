import React, {useRef, useState} from 'react';
import glass from '../../../assets/images/glass.png';
import FindModalForm from "./modal/FindModalForm.jsx";
import EmailVerifyModalForm from "./modal/EmailVerifyModalForm.jsx";
import { findId, findPassword, findVerificationCode } from '../services/findService.js';
import { useFindModal } from "../hooks/useFindModal.js";
import {useEmailVerifyModal} from "../hooks/useEmailVerifyModal.js";
import AlertModal2 from "../../../common/components/modal/AlertModal2.jsx";

const LoginForm = ({ id, setId, saveIdChecked, setSaveIdChecked, loginUser }) => {
    // 💬 useState 제거 → useRef로 값 관리
    const findNameRef = useRef('');
    const findEmailRef = useRef('');
    const findIdInputRef = useRef('');
    const findVerifyCodeRef = useRef('');
    const findTypeRef = useRef('');

    const [modalTitle, setModalTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const {
        isOpen,
        title: findTitle,
        content: findContent,
        inputs: findInputs,
        onSubmitAction,
        openModal,
        closeModal,
    } = useFindModal();

// 🔥 인증번호 입력 모달
    const {
        isVerifyModal,
        title: verifyTitle,
        content: verifyContent,
        inputs: verifyInputs,
        onSubmitCode,
        openVerifyModal,
        closeVerifyModal,
    } = useEmailVerifyModal();


    // 🔥 ID / PWD 찾기 모달 열기
    const handleFindModal = (type) => {
        findTypeRef.current = type; // 바로 쓸 수 있음

        openModal({
            modalTitle: type === "ID" ? "아이디 찾기" : "비밀번호 찾기",
            modalContent: type === "ID"
                ? "회원가입 시 입력한 이름과 이메일을 입력하세요."
                : <>아이디와 이메일을 입력해주세요.<br/>해당 이메일로 임시 비밀번호를 보내드립니다.</>,
            modalInputs: type === "ID"
                ? [
                    { label: "이름", type: "text", name: "name", onChange: (e) => findNameRef.current = e.target.value },
                    { label: "이메일", type: "email", name: "email", onChange: (e) => findEmailRef.current = e.target.value },
                ]
                : [
                    { label: "아이디", type: "text", name: "id", onChange: (e) => findIdInputRef.current = e.target.value },
                    { label: "이메일", type: "email", name: "email", onChange: (e) => findEmailRef.current = e.target.value },
                ],
            onSubmit: async () => {
                let message = "";
                let title = '';
                try {
                    const result = findTypeRef.current === "ID"
                        ? await findId(findNameRef.current, findEmailRef.current)
                        : await findPassword(findIdInputRef.current, findEmailRef.current);

                    setModalTitle('성공')
                    setModalMessage(result.message);
                    setShowModal(true);
                    closeModal();
                    openFindVerifyModal();
                } catch (err) {
                    console.error(err);
                    setModalTitle('실패');
                    setModalMessage("인증 코드 전송 실패");
                    setShowModal(true);
                    AlertModal2({title:title, message: message, onClose: true });
                }
            },
        });
    };

    // 🔥 인증번호 입력 모달 열기
    const openFindVerifyModal = () => {
        openVerifyModal({
            modalTitle: "인증번호 입력",
            modalContent: "입력한 이메일로 발송된 인증번호를 입력하세요.",
            modalInputs: [
                { label: "인증코드", type: "text", name: "code", onChange: (e) => findVerifyCodeRef.current = e.target.value },
            ],
            onSubmit: async () => {
                try {
                    const result = await findVerificationCode(findEmailRef.current, findVerifyCodeRef.current, findTypeRef.current);
                    console.log(result);
                        setModalTitle('성공');
                        setModalMessage(result.message);
                        setShowModal(true);
                        closeVerifyModal();

                } catch (err) {
                    console.error(err);
                    setModalTitle('실패');
                    setModalMessage("인증에 실패하였습니다.");
                    setShowModal(true);
                }
            },
        });
    };

    return (
        <div>
            <form className="flex flex-col space-y-3 w-full max-w-2xl p-4">
                <h2 className="text-xl font-semibold text-center">회원 로그인</h2>

                {/* 아이디 입력 */}
                <div className="border border-gray-300 ml-1 mr-1 mb-1 mt-1">
                    <label className="border-r-2 px-5 text-[#8A8A8A] font-light text-xs" htmlFor="id">아이디</label>
                    <input
                        id="id"
                        name="id"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="ml-2 py-2 w-3/4 focus:outline-none"
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div className="border border-gray-300 ml-1 mr-1 mb-1 mt-1">
                    <label className="border-r-2 text-[#8A8A8A] px-3.5 text-xs font-light" htmlFor="password">비밀번호</label>
                    <input
                        id="pwd"
                        name="pwd"
                        type="password"
                        className="ml-2 py-2 w-3/4 focus:outline-none"
                    />
                </div>

                {/* 로그인 버튼 */}
                <button type="button" onClick={loginUser} className="bg-[#575757] border-0 text-white py-2 rounded">
                    로그인
                </button>

                {/* 아이디/비밀번호 찾기 버튼 */}
                <div className="flex items-center justify-between text-xs">
                    <label className="flex">
                        <input
                            type="checkbox"
                            checked={saveIdChecked}
                            onChange={() => setSaveIdChecked(!saveIdChecked)}
                        />
                        &nbsp;아이디 기억
                    </label>
                    <div className="flex space-x-2">
                        <img src={glass} className="h-4 border-r-2" alt="Search Icon" />
                        <div className="space-x-2">
                            <button type="button" onClick={() => handleFindModal("ID")}>아이디 찾기</button>
                            <button type="button" onClick={() => handleFindModal("PWD")}>비밀번호 찾기</button>
                        </div>
                    </div>
                </div>
            </form>

            {/* 모달 연결 */}
            <FindModalForm
                title={findTitle}
                content={findContent}
                isOpen={isOpen}
                onClose={closeModal}
                onSubmit={onSubmitAction}
                inputs={findInputs}
            />
            <EmailVerifyModalForm
                title={verifyTitle}
                content={verifyContent}
                isOpen={isVerifyModal}
                onClose={closeVerifyModal}
                onSubmit={onSubmitCode}
                inputs={verifyInputs}
            />
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

export default LoginForm;
