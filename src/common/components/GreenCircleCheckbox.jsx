import React, { useState } from 'react';
import { Check } from 'lucide-react';

const GreenCircleCheckbox = () => {
  const [isChecked, setIsChecked] = useState(false);
  
  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only" // 기본 체크박스 숨기기
          checked={isChecked}
          onChange={handleChange}
        />
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2 ${
          isChecked 
            ? 'bg-green border-green' 
            : 'bg-white border-gray-300'
        }`}>
          {isChecked && <Check className="text-white" size={16} />}
        </div>
      </label>
    </div>
  );
};

export default GreenCircleCheckbox;