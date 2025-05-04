import React from "react";

const SellerShowFileModal = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
            <div className="relative bg-white p-4 rounded shadow-lg">
                <div className="relative w-[70vw] max-w-[600px] pt-[99%]">
                    {/* 1 / 1.41 ≈ 0.707 → 70.7%, 여유 있게 99%로 맞춤 */}
                    <img
                        src={imageUrl}
                        alt="판매자 등록증 미리보기"
                        className="absolute top-0 left-0 w-full h-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default SellerShowFileModal;
