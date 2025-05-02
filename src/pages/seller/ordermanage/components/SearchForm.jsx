import React, { useState, useEffect } from "react";
import GreenSquareCheckbox from "../../../../common/components/GreenSquareCheckbox";

function SearchForm({ onSearch, onReset, initialValues= {}, showStatusFilter = false, showSortedFilter = false, }) {

  // 상태 관리
  const [startDate, setStartDate] = useState(initialValues.startDate || null);
  const [endDate, setEndDate] = useState(initialValues.endDate || null);
  const [statusIds, setStatusIds] = useState(initialValues.statusIds || {
    all: true,
    preparing: false,
    shipping: false,
    delivered: false,
    cancel: false,
    refund: false,
    exchange: false,
  });
  const [searchPeriod, setSearchPeriod] = useState(initialValues.searchPeriod || "ONE_MONTH");
  const [searchType, setSearchType] = useState(initialValues.searchType || "PRODUCT");
  const [sorted, setSorted] = useState(initialValues.sorted || "LATEST");
  const [keyword, setKeyword] = useState(initialValues.keyword || "");

  // 주문 상태 매핑 (화면 표시용)
  const statusIdsLabels = {
    all: "전체",
    preparing: "배송준비",
    shipping: "배송중",
    delivered: "배송완료",
    cancel: "취소",
    refund: "반품",
    exchange: "교환",
  };

  // 초기 값이 변경될 때 폼 상태 업데이트
  useEffect(() => {
      if (initialValues.startDate) {
        const startDateValue = initialValues.startDate.includes('T') 
          ? initialValues.startDate.split('T')[0] 
          : initialValues.startDate;
        setStartDate(startDateValue);
      }
      
      if (initialValues.endDate) {
        const endDateValue = initialValues.endDate.includes('T') 
          ? initialValues.endDate.split('T')[0] 
          : initialValues.endDate;
        setEndDate(endDateValue);
      }
      if (initialValues.searchPeriod) setSearchPeriod(initialValues.searchPeriod);
      if (initialValues.searchType) setSearchType(initialValues.searchType);
      if (initialValues.keyword) setKeyword(initialValues.keyword);
  }, [initialValues]);

  // 검색 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 날짜 유효성 검사
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert('시작 날짜는 종료 날짜보다 앞서야 합니다.');
      return;
    }
    // 시작일: 해당일 00:00:00
    const formatStartDate = startDate ? `${startDate}T00:00:00` : null;
    // 종료일: 해당일 23:59:59
    const formatEndDate = endDate ? `${endDate}T23:59:59` : null;

    
    // 백엔드 API에 맞게 상태 ID 매핑
    const statusMap = {
      preparing: 1,
      shipping: 2,
      delivered: 3,
      cancel: 4,
      refund: 5,
      exchange: 6,
    };

    let statusIdsParam = '';
    if (!statusIds.all) {
      // 선택된 상태 ID만 필터링하고 바로 문자열로 연결
      statusIdsParam = Object.entries(statusIds)
        .filter(([key, value]) => key !== 'all' && value)
        .map(([key]) => statusMap[key])
        .join(',');
    }
    
    // 검색 파라미터 구성
    const searchParams = {
      searchType,
      startDate: formatStartDate,
      endDate: formatEndDate,
      statusIds: statusIdsParam,
      searchPeriod,
      sort: sorted,
      keyword,
    };
    
    // 검색 콜백 실행
    if (onSearch) onSearch(searchParams);
  };

  // 검색 초기화 핸들러
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setStatusIds({
      all: true,
      preparing: false,
      shipping: false,
      delivered: false,
      cancel: false,
      refund: false,
      exchange: false,
    });
    setSearchPeriod("ONE_MONTH");
    setSearchType("PRODUCT");
    setSorted("LATEST");
    setKeyword("");
    
    // 초기화 콜백 실행
    if (onReset) onReset();
  };

  // 주문 상태 변경 핸들러
  const handleStatusChange = (e) => {
    const { name, checked } = e.target;

    // '전체' 옵션 처리 로직
    if (name === "all" && checked) {
      // '전체' 선택 시 다른 모든 체크박스 해제
      setStatusIds((prevStatus) => ({
        ...Object.keys(prevStatus).reduce((acc, key) => {
          acc[key] = key === "all";
          return acc;
        }, {}),
      }));
    } else {
      // 다른 상태 선택 시 '전체' 해제 및 변경 사항 적용
      const newStatusIds = {
        ...statusIds,
        [name]: checked,
        all: name === "all" ? checked : false,
      };
      
      // 어떤 상태도 선택되지 않았을 경우 전체 선택
      const hasAnySelected = Object.entries(newStatusIds)
        .filter(([key]) => key !== 'all')
        .some(([_, value]) => value);
        
      if (!hasAnySelected) {
        newStatusIds.all = true;
      }
      
      setStatusIds(newStatusIds);
    }
  };

  // 검색 기간 선택 핸들러
  const handleSearchPeriodClick = (period) => {
    setSearchPeriod(period);

    const today = new Date();
    let startDateValue = "";

    switch (period) {
      case "TODAY":
        startDateValue = today.toLocaleDateString('en-CA');
        break;
      case "WEEK": {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDateValue = lastWeek.toLocaleDateString('en-CA');
        break;
      }
      case "ONE_MONTH": {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        startDateValue = lastMonth.toLocaleDateString('en-CA');
        break;
      }
      case "THREE_MONTHS": {
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        startDateValue = threeMonthsAgo.toLocaleDateString('en-CA');
        break;
      }
      default:
        break;
    }

    setStartDate(startDateValue);
    setEndDate(today.toLocaleDateString('en-CA'));
  };

  // 엔터키 검색 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full mx-auto px-4 select-none ml-6">
      <form onSubmit={handleSubmit}>
        {/* 첫 번째 행: 검색어 입력 */}
        <div className="flex items-center mb-3 gap-2">
          <div className="w-full flex items-center">
            <div className="relative w-24 mr-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full text-sm font-medium text-gray-700 border-0 focus:outline-none focus:ring-0 bg-transparent"
              >
                <option value="PRODUCT">상품명</option>
                <option value="BUYER">구매자</option>
              </select>
            </div>
            
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-w-[400px] px-2 py-1 border border-gray-300 rounded-md text-sm mr-2"
              placeholder={`${searchType === 'PRODUCT' ? '상품명' : '구매자명'} 검색`}
            />
            
            <div className="flex items-center space-x-2">
              <select
                value={sorted}
                onChange={(e) => setSorted(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="LATEST">최신순</option>
                <option value="OLDEST">오래된순</option>
                {showSortedFilter && (
                  <>
                    <option value="PRICE_ASC">낮은가격순</option>
                    <option value="PRICE_DESC">높은가격순</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* 두 번째 행: 조회 기간 및 날짜 선택 */}
        <div className="flex flex-wrap items-center mb-3 gap-2">
          <div className="flex items-center">
            <label className="w-[75px] text-sm font-medium text-gray-700">
              조회 기간
            </label>
            <div className="flex items-center space-x-2">
              {[
                { id: "TODAY", label: "오늘" },
                { id: "WEEK", label: "1주일" },
                { id: "ONE_MONTH", label: "1개월" },
                { id: "THREE_MONTHS", label: "3개월" },
              ].map((period) => (
                <button
                  key={period.id}
                  type="button"
                  className={`px-3 py-1 text-xs border border-gray-300 rounded-md ${
                    searchPeriod === period.id 
                      ? "bg-brown text-white" 
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } transition-colors`}
                  onClick={() => handleSearchPeriodClick(period.id)}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSearchPeriod(""); // 커스텀 날짜 선택 시 기간 버튼 선택 해제
              }}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSearchPeriod(""); // 커스텀 날짜 선택 시 기간 버튼 선택 해제
              }}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
        </div>

        {/* 세 번째 행: 주문 상태 체크박스 */}
        {showStatusFilter && (
          <div className="flex flex-wrap items-center mb-4">
            <label className="w-[75px] text-sm font-medium text-gray-700">
              주문상태
            </label>
            <div className="flex flex-wrap gap-4">
              {Object.entries(statusIdsLabels).map(([key, label]) => (
                <GreenSquareCheckbox
                  key={key}
                  name={key}
                  checked={statusIds[key]}
                  onChange={handleStatusChange}
                  label={label}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* 버튼 영역 */}
        <div className="flex justify-center space-x-3 mt-2">
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium text-white bg-brown rounded-md hover:bg-brown-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            검색
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;