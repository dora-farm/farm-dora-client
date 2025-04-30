import React, { useRef, useState } from "react";

const FileUploadBox = ({setForm, file}) => {
    const fileInputRef = useRef(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setForm(prev => ({ ...prev, file: selectedFile })); // ✅ 부모 상태에 저장
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current.click();
    };

    const handleRemove = () => {
        setForm(prev => ({ ...prev, file: null }));
        fileInputRef.current.value = null;
    };

    return (
        <div className="flex flex-row justify-center items-center ">
            <div className="flex flex-row ml-4 w-full items-center border-b-2 space-x-6 ">
            <label className="text-gray-700 p-3 py-16 w-36 bg-gray text-sm">사업자 등록증</label>
            <input
                type="file"
                accept="image/*"
                hidden
                name="file"
                id="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                required={true}
            />
            {!file ? (
                <div
                    onClick={handleClickUpload}
                    className="w-32 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-4xl text-gray-400 cursor-pointer"
                >
                    +
                </div>
            ) : (
                <div className="relative w-32 h-32 cursor-pointer group">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="object-cover w-full h-full rounded"
                        onClick={() => setShowPreview(true)}
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-0 right-0 bg-black text-white text-xs px-1 py-0.5 rounded opacity-80 group-hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>
            )}
            </div>
            {showPreview && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                    onClick={() => setShowPreview(false)}
                >
                    <img
                        src={URL.createObjectURL(file)}
                        alt="full"
                        className="max-w-full max-h-full"
                    />
                </div>
            )}
        </div>
    );
};

export default FileUploadBox;
