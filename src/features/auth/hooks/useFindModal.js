import { useState } from "react";

export const useFindModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [inputs, setInputs] = useState([]);
  const [onSubmitAction, setOnSubmitAction] = useState(() => {});
  const [onSubmitCode, setOnSubmitCode] = useState(()=>{});
  const [isVerifyModal, setIsVerifyModal] = useState(false);

  const openModal = ({ modalTitle, modalContent, modalInputs, onSubmit }) => {
    setTitle(modalTitle);
    setContent(modalContent);
    setInputs(modalInputs);
    setOnSubmitAction(() => onSubmit);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openVerifyModal = ({ modalTitle, modalContent, modalInputs, onSubmit }) => {
    setTitle(modalTitle);
    setContent(modalContent);
    setInputs(modalInputs);
    setOnSubmitCode(() => onSubmit);
    setIsVerifyModal(true);
  };

  const closeVerifyModal = () => {
    setIsVerifyModal(false);
  }

  return {
    isOpen,
    title,
    content,
    inputs,
    onSubmitAction,
    openModal,
    closeModal,
    isVerifyModal,
    openVerifyModal,
    closeVerifyModal,
    onSubmitCode,
  };
};
