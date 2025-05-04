import React from 'react';
import AddressSearchBox from '../../../features/auth/components/AddressSearchBox.jsx';

export default function ManageAddressModal({isOpen, onClose, form, handleChange, onSubmit, title, handleGetUserAddr}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-green text-xl font-bold">{title}</h2>
                <div className="flex w-full justify-end">
                    <button type={`button`} onClick={handleGetUserAddr} className={`text-green p-1 mb-2 border border-gray-300 rounded-md text-end text-xs`} >내 정보</button>
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
                           value={form.phoneNum ?? ''} onChange={handleChange}/>
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
                               value={form.postNum ?? ''} readOnly/>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <input
                        className="border w-4/5 text-gray-dark  py-1 px-2 rounded focus:outline-none font-normal mb-1"
                        id="addr" name="addr"
                        value={form.addr ?? ''} readOnly/>
                    <input className="border w-4/5 text-gray-dark py-1 px-2 rounded focus:outline-none font-normal mb-1"
                           id="detailAddr" name="detailAddr"
                           value={form.detailAddr ?? ''} onChange={handleChange}/>
                </div>
                <div className="flex mb-1 justify-between items-center">
                    <label htmlFor="require" className="font-normal text-gray-dark">요청사항</label>
                    <input className="border w-4/5 py-1 px-2 rounded focus:outline-none font-normal mb-1" id="require"
                           name="require"
                           value={form.require ?? ''} onChange={handleChange}/>
                </div>
                <label className="flex items-center gap-1 my-2 text-sm font-normal">
                    <input
                        className="w-5 h-5"
                        type="checkbox" name="defaultAddress" checked={form.defaultAddress} onChange={handleChange}/>
                    기본 배송지로 설정
                </label>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray hover:bg-gray-200 px-4 py-1 rounded ">취소</button>
                    <button onClick={onSubmit} className="bg-green hover:bg-[#009977] text-white px-4 py-1 rounded">저장
                    </button>
                </div>
            </div>
        </div>
    );
}
