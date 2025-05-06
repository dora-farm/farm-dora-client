import {useState} from 'react';
import {formatPhoneNumber} from "../services/validationService.js";

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

    const handleChange = (e,setPhoneValid) => {
        const {name, value, type, checked} = e.target;

        let newVal = value;

        if (name === 'phoneNum') {
            newVal = formatPhoneNumber(value,setPhoneValid);
        }

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : newVal,
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
            defaultAddress: data.defaultAddress ?? false,
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
