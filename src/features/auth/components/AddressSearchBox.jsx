import React, {useState} from 'react';
import DaumPostcode from 'react-daum-postcode';

export default function AddressSearchBox({onComplete, className}) {
    const [visible, setVisible] = useState(false);
    const handleComplete = (data) => {
        onComplete(data);
        setVisible(false);
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    if (visible)
                        setVisible(false);
                    else {
                        setVisible(true);
                    }
                }
                }
                className={className}
            >
                주소찾기
            </button>

            {visible && (
                <div className="absolute border p-2 rounded bg-white z-50">
                    <DaumPostcode onComplete={handleComplete}/>
                </div>
            )}
        </div>
    );
}
