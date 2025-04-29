import { useState } from "react";

export const useEmailVerifyModal = () => {

    const [isVerifyModal, setIsVerifyModal] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [inputs, setInputs] = useState([]);
    const [onSubmitCode, setOnSubmitCode] = useState(() => {});

    const openVerifyModal = ({ modalTitle, modalContent, modalInputs, onSubmit }) => {
        setTitle(modalTitle);
        setContent(modalContent);
        setInputs(modalInputs);
        setOnSubmitCode(() => onSubmit);
        setIsVerifyModal(true);
    };

    const closeVerifyModal = () => {
        setIsVerifyModal(false);
    };

    return {
        isVerifyModal,
        title,
        content,
        inputs,
        onSubmitCode,
        openVerifyModal,
        closeVerifyModal,
    };
};