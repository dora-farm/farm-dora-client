import React, {useState} from 'react';
import {expireUser} from "../../features/auth/services/userUpdateService.js";
import AlertModal2 from "../../common/components/modal/AlertModal2.jsx";
import ConfirmModal from "./modal/ConfimModal.jsx";
import {logoutUser} from "../../features/auth/services/authService.js";
import {useNavigate} from "react-router-dom";


function DeleteAccount() {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [shouldLogout, setShouldLogout] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const navigate = useNavigate();

    const handleExpireOpenModal = async (e) => {
        e.preventDefault();

        setConfirmOpen(true);
    };

    const handleSubmit = async () => {
        const pwd = document.getElementById("pwd").value;
        try{
        const result = await expireUser(pwd);
            setModalTitle('성공');
            setModalMessage(result.data.message);
            setShouldLogout(true);
            setShowModal(true);
        }catch (e){
            setModalTitle('실패');
            setModalMessage(e.response.data.message);
            setShowModal(true);
        }
    }

    return (
        <form onSubmit={handleExpireOpenModal} className="flex items-center flex-col w-full">
            <h1 className={`text-2xl font-extrabold mt-6 mb-6`}>회원탈퇴</h1>
            <div className={`w-3/4`}>
                <div className="border p-5 ">
                    <h3 className={`text-green font-bold text-sm mb-4`}>탈퇴하시기 전에 아래 정보를 꼭 확인해주세요.</h3>
                    <ul className={`list-disc ml-5 text-xs text-gray-dark mb-12`}>
                        <li className={`mb-3`}>회원에서 탈퇴하시면 현재 사용 중이신 계정을 더 이상 사용할 수 없게 됩니다.</li>
                        <li className={`mb-3`}>한 번 삭제된 계정은 이전 상태로 복구할 수 없습니다.</li>
                        <li className={`mb-3`}>한 번 탈퇴한 사용자라 하더라도 언제든 다시 FarmDora에 회원 가입을 할 수 있습니다.</li>
                    </ul>
                    <h3 className={`text-green font-bold text-sm mb-2`}>현재 비밀번호</h3>
                    <input type="password" id='pwd' name="pwd" placeholder={`비밀번호를 입력해 주세요`}
                        className={`text-xs py-2 px-2 w-56 focus:outline-none border rounded-md`} required
                    />
                </div>
                <div className="flex flex-row items-center mt-4 mb-4 ">
                    <input type="checkbox" id="confirm-check" className={`w-5 h-5`} required/>
                    <p className="flex flex-col ml-3 text-xs text-gray-dark">
                        <span>위 내용을 모두 확인 했습니다.</span>
                        <span>FarmDora에서 탈퇴하겠습니다.</span>
                    </p>
                </div>
                <button
                    type="submit"
                    className={`bg-red-600 text-white text-sm py-2 px-6 rounded-md hover:bg-red-700`}
                >
                    탈퇴하기
                </button>
            </div>

            <ConfirmModal
                title={`정말 탈퇴하시겠습니까?`}
                content={'탈퇴를 확정하면 이전 상태로 되돌릴 수 없습니다. 계속 진행하시겠습니까?'}
                isOpen={confirmOpen}
                onConfirm={() => {
                    setConfirmOpen(false);
                    handleSubmit();
                }}
                onCancel={() => setConfirmOpen(false)}
            />

            {showModal && (
                <AlertModal2
                    title={modalTitle}
                    message={modalMessage}
                    onClose={async () => {
                        setConfirmOpen(false);
                        setShowModal(false);
                        if (shouldLogout) {
                            await logoutUser(navigate);
                            setShouldLogout(false); // 다음 호출을 위해 초기화
                        }
                    }}
                />
            )}

        </form>
    );
}

export default DeleteAccount;
