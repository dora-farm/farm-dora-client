import React, { useState } from 'react';

function SearchForm({ onSearch, onReset }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderStatus, setOrderStatus] = useState({
    complete: true,
    preparing: false,
    shipping: false,
    delivered: false,
    etc: false,
    refund: false,
    exchange: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      startDate,
      endDate,
      orderStatus
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setOrderStatus({
      complete: false,
      preparing: false,
      shipping: false,
      delivered: false,
      etc: false,
      refund: false,
      exchange: false
    });
    if (onReset) onReset();
  };

  const handleStatusChange = (e) => {
    setOrderStatus({
      ...orderStatus,
      [e.target.name]: e.target.checked
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
      <form onSubmit={handleSubmit}>
        {/* 첫 번째 행: 셀렉트 박스와 날짜 선택 */}
        <div className="flex flex-wrap items-center mb-3 gap-2">
          <div className="flex items-center">
            <label className="w-20 text-sm font-medium text-gray-700">조회 기간</label>
            <div className="flex items-center space-x-2">
              <button type="button" className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-100">오늘</button>
              <button type="button" className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-100">1주일</button>
              <button type="button" className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-100">1개월</button>
              <button type="button" className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-100">3개월</button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
        
        {/* 두 번째 행: 주문 상태 체크박스 */}
        <div className="flex flex-wrap items-center mb-4">
          <label className="w-20 text-sm font-medium text-gray-700">주문상태</label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="complete"
                checked={orderStatus.complete}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">전체</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="preparing"
                checked={orderStatus.preparing}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">배송준비</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="shipping"
                checked={orderStatus.shipping}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">배송중</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="delivered"
                checked={orderStatus.delivered}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">배송완료</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="etc"
                checked={orderStatus.etc}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">기타</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="refund"
                checked={orderStatus.refund}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">반품</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="exchange"
                checked={orderStatus.exchange}
                onChange={handleStatusChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">교환</span>
            </label>
          </div>
        </div>
        
        {/* 버튼 영역 */}
        <div className="flex justify-center space-x-2">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            검색
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            초기화
          </button>
          
          <div className="flex items-center ml-auto">
            <select className="text-sm border border-gray-300 rounded-md p-1">
              <option value="10">10개씩 보기</option>
              <option value="20">20개씩 보기</option>
              <option value="50">50개씩 보기</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;