import React, {useState, useEffect, useRef} from 'react';
import SocialLoginForm from "./SocialLoginForm.jsx";
import ProfileField from "./ProfileField.jsx";
import DaumPostcode from "react-daum-postcode";
import {registerSocial} from "../services/authService.js";
import {getUserInfo, updateProfile} from "../services/userUpdateService.js";
// import AlertModal from "../../../common/components/modal/AlertModal.jsx";
import {
    confirmPwd,
    formatPhoneNumber, sendVerificationEmail,
    validateEmail,
    validatePwd, verifyEmailCode
} from "../services/validationService.js";
import useFormValidation from "../hooks/useFormValidation.js";
import {useEmailVerifyModal} from "../hooks/useEmailVerifyModal.js";
import EmailVerifyModalForm from "./modal/EmailVerifyModalForm.jsx";
import {useNavigate} from "react-router-dom";
import AlertModal2 from "@/common/components/modal/AlertModal2.jsx";

const EditProFileFrom = () => {
    const findVerifyCodeRef = useRef('');
    const [formValid, setFormValid] = useFormValidation();

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const navigate = useNavigate();
    const [navigateOn, setNavigateOn] = useState(false);

    const [form, setForm] = useState({
        name: '',
        id: '',
        pwd: '',
        phoneNum: '',
        email: '',
        accountNum: '',
        postNum: '',
        addr: '',
        detailAddr: '',
        bankId: '',      // bankType.bankId를 저장
        bankName: '',    // bankType.bankName도 필요하면 저장
        birth: '',
        sex: '',
    });

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
            openUpdateVerifyModal();
        }
    };


    const openUpdateVerifyModal = () => {
        openVerifyModal({
            modalTitle: "인증번호 입력",
            modalContent: "입력한 이메일로 발송된 인증번호를 입력하세요.",
            modalInputs: [
                { label: "인증코드", type: "text", name: "code", onChange: (e) => findVerifyCodeRef.current = e.target.value },
            ],
            onSubmit: async () => {
                try {
                    const result = await verifyEmailCode(form.email, findVerifyCodeRef.current, setFormValid);
                    if(result.data){
                        setModalTitle("인증 성공");
                        setModalMessage(result.message);
                        setShowModal(true);
                        closeVerifyModal();
                    }else {
                        setModalTitle("인증 성공 실패");
                        setModalMessage("인증에 실패하였습니다.");
                        setShowModal(true);
                    }
                } catch (err) {
                    console.error(err);
                    setModalTitle("인증 성공 실패");
                    setModalMessage("인증에 실패하였습니다.");
                    setShowModal(true);
                }
            },
        });
    };

    const [isPostOpen, setIsPostOpen] = useState(false);


    const loadUser = async () => {
        try {
            const { data } = await getUserInfo();
            setForm({
                name: data.data.name || '',
                id: data.data.id || '',
                pwd: '',
                confirmPassword: '',
                phoneNum: data.data.phoneNum || '',
                email: data.data.email || '',
                accountNum: data.data.accountNum || '',
                postNum: data.data.address?.postNum || '',
                addr: data.data.address?.addr || '',
                detailAddr: data.data.address?.detailAddr || '',
                bankId: data.data.bankType?.bankId || '',
                bankName: data.data.bankType?.bankName || '',
                birth: data.data.birth || '',
                sex: data.data.sex || '',
            });
            console.log(data.data);
        } catch (err) {
            console.error("유저 정보 불러오기 실패", err);
        }
    };

// 2. useEffect 안에서는 자동 호출
    useEffect(() => {
        loadUser();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        // 이름이 phoneNum이면 하이픈 붙여서 저장
        if (name === 'phoneNum') {
            newValue = formatPhoneNumber(value);
        }

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };


    const handleComplete = (data) => {
        setForm((prev) => ({
            ...prev,
            postNum: data.zonecode,
            addr: data.address + (data.buildingName ? ` (${data.buildingName})` : ''),
        }));
        setIsPostOpen(false);
    };

    const updateUserProfile = async (e) => {
        console.log("실행");
        e.preventDefault();
        console.log(form)
        const requestDto = {
            phoneNum: form.phoneNum || '',
            email: formValid['email'] && formValid['email_verified'] ? form.email : null,
            accountNum: form.accountNum || '',
            bankId: form.bankId || '',
            pwd: formValid['pwd'] && formValid['password_confirmation'] ? form.pwd : null,
            address: {
                postNum: form.postNum || '',
                addr: form.addr || '',
                detailAddr: form.detailAddr || '',
            },
        }
        try {
            const result = await updateProfile(requestDto);
            console.log(result.data);
            if (result.data.data) {
                setModalTitle('성공');
                setModalMessage(result.data.message);
                setNavigateOn(true);         // ✅ 성공 시에만 이동 플래그 ON
                setShowModal(true);          // ✅ 모달 표시
            } else {
                setModalTitle('실패');
                setModalMessage(result.message); // 실패 메시지
                setNavigateOn(false);                // 이동 안 함
                setShowModal(true);
            }
        } catch (error) {
            console.error(error);
            setModalTitle('실패');
            setModalMessage("오류가 발생했습니다.");
            setNavigateOn(false);                  // 오류 발생 시도 이동 안 함
            setShowModal(true);
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h1 className="text-2xl font-extrabold mt-4">회원정보 수정</h1>
            <div className="flex flex-col w-full ml-16 mb-4">
                <SocialLoginForm onRegister={registerSocial} title="간편 로그인 연동"
                                 className="border-b-2 border-b-black py-3"/>
            </div>
            <form className="flex flex-col w-full ml-16">
                <h2 className="ml-4 border-b-2 pb-2 border-b-black">회원정보 입력</h2>

                {/* 각각 수정 */}
                <ProfileField
                    label="이름" name="name" id="name" type="text"
                    value={form.name}
                    readOnly={true}
                    onChange={handleChange}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border bg-gray p-1 text-sm rounded focus:outline-none"
                />

                <ProfileField
                    label="아이디" name="id" id="id" type="text"
                    value={form.id}
                    readOnly={true}
                    onChange={handleChange}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="bg-gray border p-1 text-sm rounded focus:outline-none"
                />

                <ProfileField
                    label="비밀번호" name="pwd" id="pwd" type="password"
                    value={form.pwd}
                    readOnly={false}
                    onChange={(e)=>{handleChange(e); validatePwd(setFormValid)}}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 text-sm w-1/3 rounded focus:outline-none"
                >
                    <span className="text-xs text-gray-dark">영대소문자와 숫자를 포함해 8~16자 사이를 입력해 주세요</span>
                </ProfileField>
                <ProfileField
                    label="비밀번호 확인" name="confirmPassword" id="confirm-password" type="password"
                    value={form.confirmPassword}
                    readOnly={false}
                    onChange={(e)=>{handleChange(e); confirmPwd(setFormValid)}}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 text-sm w-1/3 rounded focus:outline-none"
                >
                    <span id="alertPwd" className="text-xs text-red-600"></span>
                </ProfileField>

                <ProfileField
                    label="휴대폰" name="phoneNum" id="phoneNum" type="tel"
                    value={form.phoneNum}
                    readOnly={false}
                    onChange={handleChange}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 text-sm rounded focus:outline-none"
                />

                <ProfileField
                    label="이메일" name="email" id="email" type="email"
                    value={form.email}
                    readOnly={false}
                    onChange={(e)=>{handleChange(e); validateEmail(setFormValid)}}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 w-1/3 text-sm rounded focus:outline-none"
                >
                    {formValid['email'] && <button type="button" onClick={handleSendEmailCode} className="mt-2 bg-gray-200 text-xs rounded-md p-1 mb-2">
                        인증 메일 보내기
                    </button>}
                    <span id="alertEmail" className="text-xs text-red-600"></span>
                </ProfileField>

                <ProfileField
                    label="계좌" name="accountNum" id="accountNum" type="text"
                    value={form.accountNum}
                    readOnly={false}
                    onChange={handleChange}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 text-sm rounded focus:outline-none"
                >
                    <select
                        className="p-1 border focus:outline-none"
                        name="bankId"
                        value={form.bankId}
                        onChange={handleChange}
                    >
                        <option value="1">신한은행</option>
                        <option value="2">국민은행</option>
                        <option value="3">우리은행</option>
                        <option value="4">하나은행</option>
                        <option value="5">농협은행</option>
                        <option value="6">카카오뱅크</option>
                        <option value="7">토스뱅크</option>
                    </select>
                </ProfileField>

                {/* 주소는 별도로 관리 */}
                <ProfileField label="주소" labelClassName="text-gray-700 py-12 px-3 w-36 bg-gray text-sm">
                    <div className="flex flex-col w-80">
                        <div className="flex-row">
                            <button type="button" onClick={() => setIsPostOpen(true)}
                                    className="bg-gray-200 text-xs rounded-md p-1 mb-1">
                                주소 검색
                            </button>
                            {isPostOpen && (
                                <div className="absolute z-50 mt-2 bg-white border rounded shadow">
                                    <DaumPostcode onComplete={handleComplete} autoClose/>
                                    <button type="button" onClick={() => setIsPostOpen(false)}
                                            className="w-full text-center text-sm py-1 border-t">
                                        닫기
                                    </button>
                                </div>
                            )}
                            <input
                                type="text"
                                name="postNum"
                                id="postNum"
                                value={form.postNum}
                                readOnly
                                className="border p-1 w-1/2 ml-1 mb-1 focus:outline-none text-sm"
                            />
                        </div>
                        <input
                            type="text"
                            name="addr"
                            id="addr"
                            value={form.addr}
                            readOnly
                            className="border w-full p-1 mb-1 focus:outline-none text-sm"
                        />
                        <input
                            type="text"
                            name="detailAddr"
                            id="detailAddr"
                            value={form.detailAddr}
                            onChange={handleChange}
                            className="text-sm p-1 border focus:outline-none"
                        />
                    </div>
                </ProfileField>

                {/* 저장 버튼 */}
                <div className="ml-40 space-x-72 mb-4">
                    <button type="button" className="p-1 w-20 mt-1 mb-2 rounded-md text-white bg-green"
                            onClick={updateUserProfile}>수정
                    </button>
                    <button type="button" onClick={loadUser} className="bg-warning p-1 w-20 mt-1 mb-2 rounded-md text-white">취소</button>
                </div>
            </form>
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
                    onClose={() => {
                        setShowModal(false);
                        if (navigateOn) {
                            navigate("/my/user"); // 또는 원하는 경로
                        }
                    }}
                />
            )}
        </div>
    );
}

export default EditProFileFrom;
