import React from 'react';

function DateFilter({ dateRange, selectedRange, onRangeUpdate }) {
  // 날짜 범위 선택 핸들러
  const handleDateRangeSelect = (range) => {
    const today = new Date();
    let startDate, endDate;
    
    switch(range) {
      case 'all':
        // 전체: 오늘부터 2년 이내
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 2);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        // 1주일: 오늘부터 7일 전
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'month':
        // 1개월: 오늘부터 30일 전
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'quarter':
        // 3개월: 오늘부터 90일 전
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      default:
        return;
    }
    
    onRangeUpdate({ startDate, endDate }, range);
  };
  
  // 수동 날짜 변경 핸들러
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newDateRange = { ...dateRange, [name]: value };
    onRangeUpdate(newDateRange, '');
  };
  
  return (
    <div className="flex items-center justify-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border-y">
      <div className="space-x-1">
        <button 
          onClick={() => handleDateRangeSelect('all')} 
          className={`px-4 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 ${
            selectedRange === 'all' 
              ? 'bg-green text-white border-green shadow-sm' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300'
          }`}
        >
          전체
        </button>
        <button 
          onClick={() => handleDateRangeSelect('week')} 
          className={`px-4 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 ${
            selectedRange === 'week' 
              ? 'bg-green text-white border-green shadow-sm' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300'
          }`}
        >
          1주일
        </button>
        <button 
          onClick={() => handleDateRangeSelect('month')} 
          className={`px-4 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 ${
            selectedRange === 'month' 
              ? 'bg-green text-white border-green shadow-sm' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300'
          }`}
        >
          1개월
        </button>
        <button 
          onClick={() => handleDateRangeSelect('quarter')} 
          className={`px-4 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 ${
            selectedRange === 'quarter' 
              ? 'bg-green text-white border-green shadow-sm' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300'
          }`}
        >
          3개월
        </button>
      </div>
      
      <div className="flex items-center space-x-2 ml-2">
        <input 
          type="date" 
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green focus:border-green"
        />
        <span className="text-gray-500">~</span>
        <input 
          type="date" 
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateChange}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-green focus:border-green"
        />
      </div>
    </div>
  );
}

export default DateFilter;