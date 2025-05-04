import React, {useEffect, useState} from 'react';
import {
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    detailAddress, getUserAddress
} from '../../features/auth/services/addressService';
import useAddressForm from '../../features/auth/hooks/useAddressForm';
import ManageAddressModal from './modal/ManageAddressModal';

const AddressManagePage = () => {
    const userId = 0;
    const [addresses, setAddresses] = useState([]);
    const [title, setTitle] = useState('');

    const {
        isOpen,
        openModal,
        closeModal,
        form,
        handleChange,
        setAddressForm,
        resetForm
    } = useAddressForm();

    const loadAddresses = async () => {
        const data = await fetchAddresses(userId);
        setAddresses(data ?? []);
    };

    const handleSubmit = async () => {
        const requestData = {
            userId,
            deliveryName: form.deliveryName,
            receiverName: form.receiverName,
            phoneNum: form.phoneNum,
            address: {
                addr: form.addr,
                detailAddr: form.detailAddr,
                postNum: form.postNum,
            },
            require: form.require,
            defaultAddr: form.defaultAddress,
            depotId: form.depotId
        };

        try {
            if (form.depotId) {
                await updateAddress(requestData);
            } else {
                await createAddress(requestData);
            }

            await loadAddresses();
            closeModal();
        } catch (err) {
            console.error('저장 실패:', err);
        }
    };

    const handleGetUserAddr = async () => {
        try{
            const userAddress = await getUserAddress();
            console.log(userAddress);
            setAddressForm({
                receiverName: userAddress.name,
                phoneNum: userAddress.phoneNum,
                postNum: userAddress.address.postNum ?? '',
                addr: userAddress.address.addr ?? '',
                detailAddr: userAddress.address.detailAddr ?? '',
            });
        }catch(err){
            console.log(err);
        }
    }

    const handleEditClick = async (depotId) => {
        try {
            const detail = await detailAddress(depotId);
            setAddressForm({
                depotId: detail.depotId,
                deliveryName: detail.deliveryName ?? '',
                receiverName: detail.receiverName ?? '',
                phoneNum: detail.phoneNum ?? '',
                postNum: detail.address?.postNum ?? '',
                addr: detail.address?.addr ?? '',
                detailAddr: detail.address?.detailAddr ?? '',
                require: detail.require ?? '',
                defaultAddress: detail.defaultAddr?? false,
            });
            setTitle('배송지 수정');
            openModal();
        } catch (err) {
            console.error('상세 조회 실패:', err);
        }
    };

    const handleDeleteClick = async (depotId) => {
        try {
            await deleteAddress(depotId);
        } catch (err) {
            console.error('삭제 실패:', err);
        }
        finally {
            await loadAddresses();
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);


    return (
        <div className="p-6 w-full flex-col items-center justify-center mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">나의 배송지</h2>
            <div className="grid gap-4 mx-auto max-w-xl">
                {addresses.map((data) => (
                    <div key={data.depotId} className="border p-4 rounded">
                        <div className="font-medium mb-2">
                            {data.receiverName}{' '}
                            {data.defaultAddr && <span className="text-xs text-green">[기본배송지]</span>}
                        </div>
                        <div className="text-xs mb-1 text-gray-900">{data.address.addr} {data.address.detailAddr}</div>
                        <div className="text-xs mb-1 text-gray-900">{data.phoneNum}</div>
                        <div className="text-xs text-gray-dark">{data.require}</div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleEditClick(data.depotId)}
                                className="border px-2 py-1 text-xs rounded bg-gray font-light hover:bg-gray-200"
                            >수정
                            </button>
                            <button
                                onClick={() => handleDeleteClick(data.depotId)}
                                className="border px-2 py-1 text-xs rounded bg-gray font-light  hover:bg-gray-200"
                            >삭제
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => {
                        resetForm();
                        setTitle('배송지 추가');
                        openModal();
                    }}
                    className="bg-green text-white px-4 py-2 rounded mt-4 hover:bg-[#009977]"
                >배송지 추가
                </button>
            </div>

            <ManageAddressModal
                isOpen={isOpen}
                onClose={closeModal}
                form={form}
                handleChange={handleChange}
                onSubmit={handleSubmit}
                title={title}
                handleGetUserAddr = {handleGetUserAddr}
            />
        </div>
    );
};

export default AddressManagePage;
