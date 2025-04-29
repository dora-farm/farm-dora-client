import React, { useEffect, useState } from "react";

function AlertModal({ title, message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-xl shadow-lg w-80 text-center transform transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="text-red-600 text-lg font-semibold mb-3">{title}</h2>
        <p className="text-gray-800">{message}</p>
        <button
          onClick={handleClose}
          className="mt-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default AlertModal;
