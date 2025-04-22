import React from 'react';
import { Check } from 'lucide-react';

const GreenCircleCheckbox = ({ checked, onChange }) => {
  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only" // 기본 체크박스 숨기기
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2 ${
          checked 
            ? 'bg-green border-green' 
            : 'bg-white border-gray-300'
        }`}>
          {checked && <Check className="text-white" size={16} />}
        </div>
      </label>
    </div>
  );
};

export default GreenCircleCheckbox;