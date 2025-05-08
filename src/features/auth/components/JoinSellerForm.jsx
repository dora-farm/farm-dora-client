import React, {useState} from "react";
import ProfileField from "./ProfileField.jsx";
import DaumPostcode from "react-daum-postcode";
import FileUploadBox from "./FileUploadBox.jsx";
import {formatPhoneNumber} from "../services/validationService.js";
import axios from "../../../common/utils/axiosInstance.js";
import AlertModal2 from "../../../common/components/modal/AlertModal2.jsx";
import {useNavigate} from "react-router-dom";

const JoinSellerForm = () => {
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        companyNum: '',
        phoneNum: '',
        postNum: '',
        addr: '',
        detailAddr: '',
        require: '',
        file: null,
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle,setModalTitle] = useState("");
    const [navigateOn, setNavigateOn] = useState(false);
    const navigate = useNavigate();
    const [formValid, setFormValid] = useState({
        name: false,
        companyNum: false,
        phoneNum: false,
        postNum: false,
        addr: false,
        detailAddr: false,
        file: false,
    });

    const sellerSubmit = async (e) => {
        e.preventDefault(); // 새로고침 방지

        const checks = [
            { key: 'name', condition: form.name !== '', message: '상호를 확인해 주세요.' },
            { key: 'companyNum', condition: form.companyNum !== '', message: '사업자 번호를 확인해 주세요.' },
            { key: 'file', condition: form.file.name !== '', message: '사업자 번호를 확인해 주세요.' },
            { key: 'phoneNum', condition: formValid.phoneNum, message: '사업자 전화번호를 확인해 주세요.' },
            { key: 'postNum', condition: form.postNum !== '', message: '우편번호를 확인해 주세요.' },
            { key: 'addr', condition: form.addr !== '', message: '주소를 확인해 주세요.' },
            { key: 'detailAddr', condition: form.detailAddr !== '', message: '상세 주소를 입력하세요.' },
        ];

        for (let check of checks) {
            if (!check.condition) {
                setModalMessage(check.message);
                setShowModal(true);
                setFormValid(prev => ({ ...prev, [check.key]: false }));
                return;
            } else {
                setFormValid(prev => ({ ...prev, [check.key]: true }));
            }
        }


        const data = {
            name: form.name,
            phoneNum: form.phoneNum,
            companyNum: form.companyNum,
            address: {
                postNum: form.postNum,
                addr: form.addr,
                detailAddr: form.detailAddr,
            },
            require: form.require,
            authId: 3,
            isApproved: false,
        };

        const formData = new FormData();
        formData.append("file", form.file); // ✅ 파일 추가
        formData.append("seller", new Blob([JSON.stringify(data)], { type: "application/json" }));
        try {
            const result = await axios.post(`${import.meta.env.VITE_AUTH_REST_API_URL}/mypage/user/register/seller`, formData, {
            });
            console.log(result);
            if(result.data.data) {
                setNavigateOn(true);
                setModalTitle('성공');
                setModalMessage("입점 신청이 완료되었습니다.");
                setShowModal(true);
            }else {
                setModalTitle('실패');
                setModalMessage("입점 신청이 실패되었습니다.");
                setShowModal(true);
            }

        } catch (e) {
            setModalTitle('실패');
            setModalMessage("입점 신청이 실패했습니다.");
            setShowModal(true);
            console.log(e);
        }
    };

    const handleComplete = (data) => {
        setForm((prev) => ({
            ...prev,
            postNum: data.zonecode,
            addr: data.address + (data.buildingName ? ` (${data.buildingName})` : ''),
        }));
        setIsPostOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        // 이름이 phoneNum이면 하이픈 붙여서 저장
        if (name === 'phoneNum') {
            newValue = formatPhoneNumber(value ,setFormValid);
        }

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleReset = () => {
        setForm({
            name: '',
            companyNum: '',
            phoneNum: '',
            postNum: '',
            addr: '',
            detailAddr: '',
            require: '',
            file: null,
        });
    }

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h1 className="text-2xl font-extrabold mt-4">입점 신청</h1>
            <form onSubmit={sellerSubmit} className="flex flex-col w-full ml-16" encType={"multipart/form-data"}>
                <h2 className="ml-4 border-b-2 pb-2 border-b-black">입점정보 입력</h2>
                <ProfileField
                    label="상호" name="name" id="name" type="text"
                    value={form.name}
                    readOnly={false}
                    onChange={handleChange}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 text-sm rounded focus:outline-none"
                    // required={true}
                />
                <ProfileField
                    label="사업자 번호" name="companyNum" id="companyNum" type="text"
                    value={form.companyNum}
                    readOnly={false}
                    onChange={handleChange}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 text-sm rounded focus:outline-none"
                    // required={true}

                />
                <FileUploadBox setForm={setForm} file={form.file}/>
                <ProfileField
                    label="사업자 전화번호" name="phoneNum" id="phoneNum" type="text"
                    value={form.phoneNum}
                    readOnly={false}
                    onChange={handleChange}
                    labelClassName="text-gray-700 p-3 w-36 bg-gray text-sm"
                    inputClassName="border p-1 text-sm rounded focus:outline-none"
                    // required={true}
                />
                <ProfileField label="주소" labelClassName="text-gray-700 p-3 py-12 w-36 bg-gray text-sm">
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
                                // required={true}
                            />
                        </div>
                        <input
                            type="text"
                            name="addr"
                            id="addr"
                            value={form.addr}
                            readOnly
                            className="border w-full p-1 mb-1 focus:outline-none text-sm"
                            // required={true}

                        />
                        <input
                            type="text"
                            name="detailAddr"
                            id="detailAddr"
                            value={form.detailAddr}
                            onChange={handleChange}
                            className="text-sm p-1 border focus:outline-none"
                            // required={true}
                        />
                    </div>
                </ProfileField>
                <div className="ml-40 space-x-72 mb-4">
                    <button
                        type="submit"
                        className="p-1 w-20 mt-1 mb-2 rounded-md text-white bg-green"
                        onSubmit={sellerSubmit} // ✅ 등록 버튼 이벤트 연결
                    >
                        등록
                    </button>
                    <button type={`reset`} onClick={handleReset} className="bg-warning p-1 w-20 mt-1 mb-2 rounded-md text-white">취소</button>
                </div>
            </form>
            {showModal && (
                <AlertModal2
                    title={modalTitle}
                    message={modalMessage}
                    onClose={() => {
                        setShowModal(false);
                        if (navigateOn) {
                            navigate("/my/user"); // 또는 원하는 경로
                        }
                    }
                }
                />
            )}
        </div>
    );
}
export default JoinSellerForm;