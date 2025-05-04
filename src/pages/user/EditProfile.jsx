import EditProFileFrom from "../../features/auth/components/EditProFileFrom.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useEmailVerifyModal} from "../../features/auth/hooks/useEmailVerifyModal.js";
import EmailVerifyModalForm from "../../features/auth/components/modal/EmailVerifyModalForm.jsx";
import AlertModal from "../../common/components/modal/AlertModal.jsx";
import {userPasswordCheck} from "../../features/auth/services/userUpdateService.js";
import {useNavigate} from "react-router-dom";


function EditProfile() {
    const checkPwd = useRef("");
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [goEdit, setGoEdit] = useState(false);

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
                <AlertModal
                    message={modalMessage}
                    onClose={() => {setShowModal(false)}}
                />
            )}
            {goEdit && <EditProFileFrom/>}
        </div>
    )
}

export default EditProfile;