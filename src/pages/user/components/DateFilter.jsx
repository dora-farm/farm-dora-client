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
  
  // 조회 버튼 핸들러
  const handleSearch = () => {
    onRangeUpdate(dateRange, '');
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <button 
        onClick={() => handleDateRangeSelect('all')} 
        className={`px-3 py-1 border border-gray-300 rounded text-sm ${
          selectedRange === 'all' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
        }`}
      >
        전체
      </button>
      <button 
        onClick={() => handleDateRangeSelect('week')} 
        className={`px-3 py-1 border border-gray-300 rounded text-sm ${
          selectedRange === 'week' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
        }`}
      >
        1주일
      </button>
      <button 
        onClick={() => handleDateRangeSelect('month')} 
        className={`px-3 py-1 border border-gray-300 rounded text-sm ${
          selectedRange === 'month' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
        }`}
      >
        1개월
      </button>
      <button 
        onClick={() => handleDateRangeSelect('quarter')} 
        className={`px-3 py-1 border border-gray-300 rounded text-sm ${
          selectedRange === 'quarter' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
        }`}
      >
        3개월
      </button>
      
      <input 
        type="date" 
        name="startDate"
        value={dateRange.startDate}
        onChange={handleDateChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
      />
      <span>~</span>
      <input 
        type="date" 
        name="endDate"
        value={dateRange.endDate}
        onChange={handleDateChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
      />
      
      <button 
        onClick={handleSearch}
        className="px-4 py-1 bg-green text-white rounded text-sm ml-2 hover:bg-green-700 transition-colors"
      >
        조회
      </button>
    </div>
  );
}

export default DateFilter;