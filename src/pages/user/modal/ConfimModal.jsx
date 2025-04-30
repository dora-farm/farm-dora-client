import React from "react";

function ConfirmModal({ isOpen, onConfirm, onCancel, content, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl border border-gray-300 w-96 px-6 py-8 text-center">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p className="text-xs text-gray-500 mb-8">
                    {content}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-100 border border-gray-300 text-sm font-bold py-2 px-5 rounded hover:bg-gray-200"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="bg-red-600 text-white text-sm font-bold py-2 px-5 rounded hover:bg-red-700"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
