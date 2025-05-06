import EditProFileFrom from "../../features/auth/components/EditProFileFrom.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useEmailVerifyModal} from "../../features/auth/hooks/useEmailVerifyModal.js";
import EmailVerifyModalForm from "../../features/auth/components/modal/EmailVerifyModalForm.jsx";
import {userPasswordCheck} from "../../features/auth/services/userUpdateService.js";
import {useLocation, useNavigate} from "react-router-dom";
import AlertModal2 from "@/common/components/modal/AlertModal2.jsx";


function EditProfile() {
    const checkPwd = useRef("");
    const navigate = useNavigate();

    const [modalTitle, setModalTitle] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [goEdit, setGoEdit] = useState(false);
    const location = useLocation();

    const goMyUser = () => {
        navigate("/my/user");
    }

    const {
        isVerifyModal,
        title: verifyTitle,
        content: verifyContent,
        inputs: verifyInputs,
        onSubmitCode,
        openVerifyModal,
        closeVerifyModal,
    } = useEmailVerifyModal();

    useEffect(() => {
        openVerifyModal({
            modalTitle: "비밀번호 입력",
            modalContent: "비밀번호를 입력해주세요",
            modalInputs: [
                { label: "비밀번호", type: "password", name: "pwd", onChange: (e) => checkPwd.current = e.target.value },
            ],
            onSubmit: async () => {
                try {
                    const result = await userPasswordCheck(checkPwd.current);
                    console.log(result.data);
                    if(result.data.data){
                        setGoEdit(true);
                        closeVerifyModal();
                    }else {
                        setModalTitle("비밀번호 검증")
                        setModalMessage(result.data.message);
                        setShowModal(true);
                    }
                } catch (err) {
                    console.error(err);
                    setModalMessage("인증에 실패하였습니다.");
                    setShowModal(true);
                }
            },
        });
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMessage = params.get("error");
        if (errorMessage === "oauthregister") {
            setModalTitle("실패");
            setModalMessage("로그인 후 마이페이지에서 연동해주세요");
            setShowModal(true);
        }
    }, [location]);

    return (

        <div className="w-full">
            <EmailVerifyModalForm
                title={verifyTitle}
                content={verifyContent}
                isOpen={isVerifyModal}
                onClose={goMyUser}
                onSubmit={onSubmitCode}
                inputs={verifyInputs}
            />
            {/* Alert 모달 */}
            {showModal && (
                <AlertModal2
                    title={modalTitle}
                    message={modalMessage}
                    onClose={() => {setShowModal(false)}}
                />
            )}
            {goEdit && <EditProFileFrom/>}
        </div>
    )
}

export default EditProfile;