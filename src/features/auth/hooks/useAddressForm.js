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
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
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
