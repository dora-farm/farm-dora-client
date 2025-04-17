import React from "react";

const PeriodSelector = ({
  period,
  startDate,
  endDate,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
  onSearch
}) => {
  return (
    <div className="flex flex-wrap items-center space-x-2 bg-gray-light border border-gray-dark rounded-md p-4 pl-6 mb-6">
      <span className="text-sm min-w-[60px]">조회 기간:</span>
      <button 
        className={`px-2 py-1 text-sm rounded-md border min-w-[50px] ${period === 'day' ? 'bg-gray-dark text-gray-light' : 'bg-white'}`}
        onClick={() => onPeriodChange('day')}
      >
        일별
      </button>
      <button 
        className={`px-2 py-1 text-sm rounded-md border min-w-[50px] ${period === 'week' ? 'bg-gray-dark text-gray-light' : 'bg-white'}`}
        onClick={() => onPeriodChange('week')}
      >
        주별
      </button>
      <button 
        className={`px-2 py-1 text-sm rounded-md border min-w-[50px] ${period === 'month' ? 'bg-gray-dark text-gray-light' : 'bg-white'}`}
        onClick={() => onPeriodChange('month')}
      >
        월별
      </button>
      <input 
        type="date" 
        className="px-2 py-1 text-sm border rounded-md" 
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
      />
      <span>~</span>
      <input 
        type="date" 
        className="px-2 py-1 text-sm border rounded-md" 
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
      />
      <button 
        className="px-3 py-1 text-sm rounded-md bg-black text-white min-w-[50px]"
        onClick={onSearch}
      >
        조회
      </button>
    </div>
  );
};

export default PeriodSelector;  