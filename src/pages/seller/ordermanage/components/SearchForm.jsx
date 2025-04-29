import React, { useState } from "react";
import GreenSquareCheckbox from "../../../../common/components/GreenSquareCheckbox";

/**
    검색 폼 컴포넌트
    @param {Object} props - 컴포넌트 속성
    @param {Function} props.onSearch - 검색 실행 콜백 함수
    @param {Function} props.onReset - 검색 초기화 콜백 함수
 */
function SearchForm({ onSearch, onReset }) {
  // 상태 관리
  const formatDate = (ago) => {
    const date = new Date();
    date.setDate(date.getDate() - ago);
    return date.toLocaleDateString('en-CA');
  }
  const [startDate, setStartDate] = useState(formatDate(7));
  const [endDate, setEndDate] = useState(formatDate(0));
  const [orderStatus, setOrderStatus] = useState({
    all: true, // 전체
    preparing: false, // 배송준비
    shipping: false, // 배송중
    delivered: false, // 배송완료
    cancel: false, // 취소
    refund: false, // 반품
    exchange: false, // 교환
  });
  const [searchPeriod, setSearchPeriod] = useState("WEEK");
  const [searchType, setSearchType] = useState("PRODUCT");
  const [sort, setSort] = useState("LATEST");
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [itemsPerPage, setItemsPerPage] = useState("10"); // 페이지당 아이템 수

  // 주문 상태 매핑 (화면 표시용)
  const orderStatusLabels = {
    all: "전체",
    preparing: "배송준비",
    shipping: "배송중",
    delivered: "배송완료",
    cancel: "취소",
    refund: "반품",
    exchange: "교환",
  };

  // 검색 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      startDate,
      endDate,
      orderStatus,
      searchPeriod,
      searchType,
      sort,
      searchKeyword,
      itemsPerPage: parseInt(itemsPerPage, 10),
    });
  };

  // 검색 초기화 핸들러
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setOrderStatus({
      all: false,
      preparing: false,
      shipping: false,
      delivered: false,
      cancel: false,
      refund: false,
      exchange: false,
    });
    setSearchPeriod("");
    setSearchType("PRODUCT");
    setSort("LATEST");
    setSearchKeyword("");
    setItemsPerPage("10");
    if (onReset) onReset();
  };

  // 주문 상태 변경 핸들러
  const handleStatusChange = (e) => {
    const { name, checked } = e.target;

    // '전체' 옵션 처리 로직
    if (name === "all" && checked) {
      // '전체' 선택 시 다른 모든 체크박스 해제
      setOrderStatus((prevStatus) => ({
        ...Object.keys(prevStatus).reduce((acc, key) => {
          acc[key] = key === "all";
          return acc;
        }, {}),
      }));
    } else {
      // 다른 상태 선택 시 '전체' 해제
      setOrderStatus((prevStatus) => ({
        ...prevStatus,
        [name]: checked,
        all: name === "all" ? checked : false,
      }));
    }
  };

  // 검색 기간 선택 핸들러
  const handleSearchPeriodClick = (period) => {
    setSearchPeriod(period);

    const today = new Date();
    let startDateValue = "";

    switch (period) {
      case "TODAY":
        startDateValue = today.toISOString().split("T")[0];
        break;
      case "WEEK": {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDateValue = lastWeek.toISOString().split("T")[0];
        break;
      }
      case "ONE_MONTH": {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        startDateValue = lastMonth.toISOString().split("T")[0];
        break;
      }
      case "THREE_MONTHS": {
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        startDateValue = threeMonthsAgo.toISOString().split("T")[0];
        break;
      }
      default:
        break;
    }

    setStartDate(startDateValue);
    setEndDate(today.toISOString().split("T")[0]);
  };

  return (
    <div className="w-full mx-7 select-none">
      <form onSubmit={handleSubmit}>
        {/* 첫 번째 행: 검색어 입력 */}
        <div className="flex items-center mb-3 gap-2">
          <div className="w-full flex items-center">
            <div className="relative w-20 mr-2">
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
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="min-w-[400px] px-2 py-1 border border-gray-300 rounded-md text-sm mr-2"
              placeholder="검색어를 입력하세요"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="LATEST">최신순</option>
              <option value="OLDEST">오래된 순</option>
              <option value="PRICE_ASC">가격 오름차순</option>
              <option value="PRICE_DESC">가격 내림차순</option>
            </select>
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
                    searchPeriod === period.id ? "bg-gray-200" : "bg-white"
                  } hover:bg-gray-100`}
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

        {/* 세 번째 행: 주문 상태 체크박스 */}
        <div className="flex flex-wrap items-center mb-4">
          <label className="w-[75px] text-sm font-medium text-gray-700">
            주문상태
          </label>
          <div className="flex flex-wrap gap-4">
            {Object.entries(orderStatusLabels).map(([key, label]) => (
              <GreenSquareCheckbox
                key={key}
                name={key}
                checked={orderStatus[key]}
                onChange={handleStatusChange}
                label={label}
              />
            ))}
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
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
