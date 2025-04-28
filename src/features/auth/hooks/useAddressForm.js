import {useState} from 'react';

export default function useAddressForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        depotId: null,
        deliveryName: '',
        receiverName: '',
        phoneNum: '',
        postNum: '',
        addr: '',
        detailAddr: '',
        require: '',
        defaultAddress: false,
    });

    const openModal = () => setIsOpen(true);

    const closeModal = () => {
        resetForm();
        setIsOpen(false);
    };

    const resetForm = () => {
        setForm({
            depotId: null,
            deliveryName: '',
            receiverName: '',
            phoneNum: '',
            postNum: '',
            addr: '',
            detailAddr: '',
            require: '',
            defaultAddress: false,
        });
    };

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        let newVal = value;

        if (name === 'phoneNum') {
            newVal = formatPhoneNumber(value);
        }

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : newVal,
        }));
    };

    const formatPhoneNumber = (phone) => {
        const onlyNums = phone.replace(/[^\d]/g, ''); // 숫자만 남기기
        if (onlyNums.length <= 3) return onlyNums;
        if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    };

    const setAddressForm = (data) => {
        setForm({
            depotId: data.depotId ?? null,
            deliveryName: data.deliveryName ?? '',
            receiverName: data.receiverName ?? '',
            phoneNum: data.phoneNum ?? '',
            postNum: data.postNum ?? '',
            addr: data.addr ?? '',
            detailAddr: data.detailAddr ?? '',
            require: data.require ?? '',
            defaultAddress: data.defaultAddr ?? false,
        });
    };

    return {
        isOpen,
        openModal,
        closeModal,
        form,
        handleChange,
        setAddressForm,
        resetForm,
    };
}
