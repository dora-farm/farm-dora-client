import React, { useEffect, useState } from "react";

function AlertModal2({ 
  title, 
  message, 
  onClose, 
  onConfirm = null,
  type = "alert",
}) {
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
  
  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onConfirm) onConfirm();
      else onClose();
    }, 300);
  };

  // 타이틀에 '성공'이 포함되어 있는지 확인하여 색상 결정
  const isSuccess = title?.includes('성공');
  const titleColor = isSuccess ? 'text-green-600' : 'text-red-600';
  const buttonColor = isSuccess 
    ? 'bg-green-500 hover:bg-green-600' 
    : 'bg-red-500 hover:bg-red-600';
  
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
        <h2 className={`text-lg font-semibold mb-3 ${titleColor}`}>
          {title}
        </h2>
        <p className="text-gray-800 mb-5">{message}</p>
        
        {type === "confirm" ? (
          // 확인/취소 버튼 (confirm 타입)
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
                onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded ${buttonColor}`}
            >
              확인
            </button>
          </div>
        ) : (
          // 단일 확인 버튼 (alert 타입)
          <button
              type="button"
            onClick={handleClose}
            className={`px-4 py-2 text-white rounded ${buttonColor}`}
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
}

export default AlertModal2;