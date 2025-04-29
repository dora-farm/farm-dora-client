import React from 'react';
import { Check } from 'lucide-react';

/**
 * 녹색 체크박스 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {boolean} props.checked - 체크 여부 상태
 * @param {function} props.onChange - 체크 상태 변경 이벤트 핸들러
 * @param {string} props.name - 체크박스 이름 (필수)
 * @param {string} props.label - 체크박스 레이블 (옵션)
 * @param {string} props.className - 추가 CSS 클래스 (옵션)
 * @returns {JSX.Element} 녹색 체크박스 컴포넌트
 */
const GreenSquareCheckbox = ({ 
  checked = false, 
  onChange, 
  name, 
  label, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only" // 기본 체크박스 숨기기
          checked={checked}
          onChange={onChange}
          name={name}
        />
        <div className={`w-5 h-5 border-2 flex items-center justify-center mr-1 ${
          checked 
            ? 'bg-green-600 border-green-600' 
            : 'bg-white border-gray-300'
        }`}>
          {checked && <Check className="text-white" size={16} />}
        </div>
        {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
      </label>
    </div>
  );
};

export default GreenSquareCheckbox;