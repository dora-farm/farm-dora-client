import React, { useCallback, useState, useEffect } from "react";
import DateFilter from "./components/DateFilter";
import Pagination from "../../common/components/Pagination";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ChatIcon from '@mui/icons-material/Chat';
import axios from "axios";

function MyInquiries() {
  const userId = 1;
  const itemPerPage = 10;
  
  // 상태 관리
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState("all");
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  // 날짜 범위 초기화
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    return {
      startDate: startOfYear.toLocaleDateString('en-CA'),
      endDate: today.toLocaleDateString('en-CA')
    };
  });

  // API 호출
  const loadQuestionItems = async () => {
    setLoading(true);
    setError(null);
    
    try {

      const response = await axios.get(
        `${import.meta.env.VITE_ACTIVITY_REST_API_URL}/api/my/user/question`, 
        {
          params: {
            userId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        }
      );
      
      setQuestions(response.data.data);
    } catch (error) {
      console.error("문의 내역을 불러올 수 없습니다.", error.message);
      setError("문의 내역을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 날짜 변경 시 데이터 로드
  useEffect(() => {
    loadQuestionItems();
  }, [dateRange]);

  // 날짜 필터 핸들러
  const handleRangeUpdate = (newRange, newSelected) => {
    setDateRange(newRange);
    setSelectedRange(newSelected);
  };

  // 페이지네이션 설정
  const totalPages = Math.ceil(questions.length / itemPerPage);
  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;
  const paginatedQuestions = questions.slice(
    currentPage * itemPerPage,
    currentPage * itemPerPage + itemPerPage
  );
  
  const onPageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // 문의 상세보기 토글
  const handleItemClick = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  // 문의 항목 렌더링
  const renderQuestionItem = (item) => (
    <div
      key={item.id}
      className="rounded-md border border-gray-100 bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      onClick={() => handleItemClick(item.id)}
    >
      <div className="flex justify-between">
        <div className="w-1/6 text-center text-gray-700">{item.id}</div>
        <div className="w-2/6 pl-14 text-left font-medium">{item.title}</div>
        <div className="w-2/6 text-center text-gray-600">{item.createDate}</div>
        <div className="w-1/6 text-center">
          <span 
            className={`rounded-full px-2 py-1 text-sm justify-center 
              ${item.process ? "bg-green-100 text-gray-800" : "bg-red-100 text-gray-800"}`}
          >
            {item.process ? "답변완료" : "대기중"}
          </span>
        </div>
      </div>

      {/* 문의 상세 내용 */}
      <div 
        className={`mt-4 bg-gray-50 rounded-md overflow-hidden transition-all duration-500 ease-in-out 
          ${expandedItemId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 p-0'}`}
      >
        {/* 문의 내용 */}
        <div className="p-5 border-l-4 border-warning mb-4">
          <div className="flex items-center mb-2">
            <QuestionMarkIcon className="text-warning mr-2" fontSize="small" />
            <div className="font-semibold text-gray-800">문의 내용</div>
          </div>
          <p className="text-gray-700 pl-7">
            {item.content || '등록된 문의 내용이 없습니다.'}
          </p>
        </div>
        
        {/* 답변 내용 */}
        <div className="p-5 border-l-4 border-green-500">
          <div className="flex items-center mb-2">
            <ChatIcon className="text-green-500 mr-2" fontSize="small" />
            <div className="font-semibold text-gray-800">답변</div>
          </div>
          <p className="text-gray-700 pl-7">
            {item.answer || '담당자가 확인 중입니다. 빠른 시일 내 답변드리겠습니다.'}
          </p>
        </div>
      </div>
    </div>
  );

  // 컨텐츠 상태별 렌더링
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-10 rounded-md text-center">
          <p>{error}</p>
        </div>
      );
    }
    
    if (paginatedQuestions.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-10 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <QuestionMarkIcon className="text-gray-400" style={{ fontSize: 48 }} />
            <h3 className="text-lg font-medium text-gray-700">문의 내역이 없습니다</h3>
            <p className="text-gray-500 max-w-md">
              선택하신 기간 내에 등록된 문의 내역이 없습니다.
            </p>
          </div>
        </div>
      );
    }
    
    return paginatedQuestions.map(renderQuestionItem);
  };

  return (
    <div className="w-full m-7">
      <h1 className="text-2xl font-bold text-center pb-5">내 문의 내역</h1>

      {/* 날짜 필터 */}
      <DateFilter
        dateRange={dateRange}
        selectedRange={selectedRange}
        onRangeUpdate={handleRangeUpdate}
      />
      
      {/* 테이블 헤더 */}
      <div className="hidden md:flex justify-between px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-t-md border border-b-0 border-gray-200">
        <div className="w-1/6 text-center">번호</div>
        <div className="w-2/6 text-center">제목</div>
        <div className="w-2/6 text-center">작성일</div>
        <div className="w-1/6 text-center">답변여부</div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="space-y-2">
        {renderContent()}
      </div>
      
      {/* 페이지네이션 */}
      {!loading && !error && questions.length > 0 && (
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            pageButtonCount={5}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default MyInquiries;