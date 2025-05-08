import React, {useEffect, useState} from 'react';
import AddressSearchBox from '../../../features/auth/components/AddressSearchBox.jsx';
import AlertModal2 from "@/common/components/modal/AlertModal2.jsx";

const ManageAddressModal = ({isOpen, onClose, form, handleChange, onSubmit, title, handleGetUserAddr}) => {

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [formValid, setFormValid] = useState({
        deliveryName: false,
        receiverName: false,
        addr: false,
        detailAddr: false,
        phoneNum: false,
        postNum: false,
    });

    // title이 바뀔 때마다 초기화
    useEffect(() => {
        if (title === "배송지 수정") {
            setFormValid({
                deliveryName: true,
                receiverName: true,
                addr: true,
                detailAddr: true,
                phoneNum: true,
                postNum: true,
            });
        } else {
            setFormValid({
                deliveryName: false,
                receiverName: false,
                addr: false,
                detailAddr: false,
                phoneNum: false,
                postNum: false,
            });
        }
    }, [title]);

    if (!isOpen) return null;

    const handleOnSumit =() =>{
        const checks = [
            { key: 'deliveryName', condition: form.deliveryName !== '', message: '배송지명을 입력해주세요.' },
            { key: 'receiverName', condition: form.receiverName, message: '받는사람을 입력해 주세요.' },
            { key: 'phoneNum', condition: formValid.phoneNum, message: '휴대폰 번호를 확인해주세요.' },
            { key: 'postNum', condition: form.postNum !== '', message: '우편번호를 입력하세요.' },
            { key: 'addr', condition: form.addr !== '', message: '주소를 입력하세요.' },
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

        onSubmit(form);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-green text-xl font-bold">{title}</h2>
                <div className="flex w-full justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            handleGetUserAddr();
                            setFormValid(prev =>
                                Object.fromEntries(Object.keys(prev).map(key => [key, true]))
                            );
                        }}
                        className="text-green p-1 mb-2 border border-gray-300 rounded-md text-end text-xs"
                    >
                        내 정보
                    </button>
                </div>
                <div className="flex justify-between mb-1 items-center">
                    <label htmlFor="deliveryName" className="font-normal text-gray-dark">배송지명</label>
                    <input className="border w-4/5 py-1 px-2 rounded focus:outline-none font-normal mb-1"
                            id="deliveryName" name="deliveryName"
                            value={form.deliveryName ?? ''} onChange={handleChange}/>
                </div>
                <div className="flex mb-1 justify-between items-center">
                    <label htmlFor="receiverName" className="font-normal text-gray-dark">받는사람</label>
                    <input className="border w-4/5 py-1 px-2 rounded focus:outline-none font-normal mb-1"
                            id="receiverName" name="receiverName"
                            value={form.receiverName ?? ''} onChange={handleChange}/>
                </div>
                <div className="flex mb-1 justify-between items-center">
                    <label htmlFor="phoneNum" className="font-normal text-gray-dark">전화번호</label>
                    <input className="border w-4/5 py-1 px-2 rounded focus:outline-none font-normal mb-1" id="phoneNum"
                            name="phoneNum"
                            value={form.phoneNum ?? ''} onChange={(e)=>{handleChange(e,setFormValid)}}/>
                </div>
                <div className="flex justify-between mb-1 items-center">
                    <label htmlFor="postNum" className="font-normal text-gray-dark">주소</label>
                    <div className="flex justify-between items-center w-4/5">
                        <AddressSearchBox onComplete={(data) => {
                            const fullAddress = data.address + (data.buildingName ? ` (${data.buildingName})` : '');
                            handleChange({target: {name: 'postNum', value: data.zonecode}});
                            handleChange({target: {name: 'addr', value: fullAddress}});
                        }}
                                        className="border border-green text-green text-xs py-1 px-1 rounded font-normal mb-1"
                        />

                        <input className="border w-3/4 py-1 px-2 rounded focus:outline-none font-normal mb-1"
                            id="postNum"
                            name="postNum"
                            value={form.postNum ?? ''} readOnly
                        />
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <input
                        className="border w-4/5 text-gray-dark  py-1 px-2 rounded focus:outline-none font-normal mb-1"
                        id="addr" name="addr"
                        value={form.addr ?? ''} readOnly/>
                    <input className="border w-4/5 text-gray-dark py-1 px-2 rounded focus:outline-none font-normal mb-1"
                        id="detailAddr" name="detailAddr"
                        value={form.detailAddr ?? ''} onChange={handleChange}
                    />
                </div>
                <div className="flex mb-1 justify-between items-center">
                    <label htmlFor="require" className="font-normal text-gray-dark">요청사항</label>
                    <input className="border w-4/5 py-1 px-2 rounded focus:outline-none font-normal mb-1" id="require"
                        name="require"
                        value={form.require ?? ''} onChange={handleChange}
                    />
                </div>
                <label className="flex items-center gap-1 my-2 text-sm font-normal">
                    <input
                        className="w-5 h-5"
                        type="checkbox" name="defaultAddress" checked={form.defaultAddress} onChange={handleChange}/>
                    기본 배송지로 설정
                </label>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray hover:bg-gray-200 px-4 py-1 rounded ">취소</button>
                    <button onClick={handleOnSumit} className="bg-green hover:bg-[#009977] text-white px-4 py-1 rounded">저장
                    </button>
                </div>
            </div>
            {showModal &&
                <AlertModal2
                    type={`button`}
                    message={modalMessage}
                    onClose={() => {setShowModal(false)}}
                />
            }
        </div>
    );
}
export default ManageAddressModal;
