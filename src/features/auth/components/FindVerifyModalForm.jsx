import React, {useEffect, useState} from "react";

const FindVerifyModalForm = ({isOpen, onClose, inputs, title, onSubmit, content}) => {
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(()=>{
        if (!isOpen){setTimeLeft(300); return;}

        const timer = setInterval(()=>{
            setTimeLeft(prev =>{
                if (prev <= 1){
                    clearInterval(timer);
                    alert("인증 시간이 만료되었습니다.")
                    onClose();
                    return 0;
                }
                return prev-1;
            });
        },1000);
        return () => {clearInterval(timer);};
    },[isOpen]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' + s : s}`;
    };

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
                    <p className="text-center text-red-500 mb-4">남은 시간: {formatTime(timeLeft)}</p>
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

export default FindVerifyModalForm;
