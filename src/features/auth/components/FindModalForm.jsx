import React from "react";

const FindModalForm = ({ isOpen, onClose, title, content, inputs, onSubmit }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h1 className="text-xl font-bold mb-2 text-center">{title}</h1>
                <p className="text-sm text-center text-gray-600 mb-4 whitespace-pre-line">{content}</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="space-y-3"
                >
                    {inputs.map(({ label, type, name, onChange }, idx) => (
                        <div key={idx}>
                            <label className="block text-sm mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                onChange={onChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ))}
                    <button type="submit" className="w-full bg-black text-white p-2 rounded">확인</button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full text-gray-500 text-sm mt-2 underline"
                    >
                        닫기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FindModalForm;
