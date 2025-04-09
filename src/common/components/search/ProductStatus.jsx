// src/components/SalesStatus.jsx
import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

function SalesStatus({ filters, handleFilterChange }) {
  // 이벤트 핸들러를 래핑하는 함수
  const handleChange = (event) => {
    // 이벤트 객체를 명시적으로 전달
    handleFilterChange(event);
  };

  return (
    <div className="flex items-center mb-3">
      <div className="w-24 font-medium">판매상태</div>
      <FormControlLabel
        control={
          <Checkbox 
            checked={filters.INSTOCK} 
            onChange={handleChange}
            name="INSTOCK" 
          />
        }
        label="판매 중"
      />
      <FormControlLabel
        control={
          <Checkbox 
            checked={filters.PREORDER} 
            onChange={handleChange}
            name="PREORDER" 
          />
        }
        label="판매중지"
      />
    </div>
  );
}

export default SalesStatus;

