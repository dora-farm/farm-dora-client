/**
 * 재사용 가능한 페이지네이션 컴포넌트
 * @param {Object} props
 * @param {number} props.currentPage - 현재 페이지 (0부터 시작)
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {boolean} props.hasNext - 다음 페이지 존재 여부
 * @param {boolean} props.hasPrev - 이전 페이지 존재 여부
 * @param {Function} props.onPageChange - 페이지 변경 시 호출되는 함수, 인자로 새 페이지 번호 전달
 * @param {number} [props.pageButtonCount=5] - 표시할 페이지 버튼 개수
 * @param {string} [props.activeColor="bg-green"] - 활성 페이지 버튼 배경색
 * @param {string} [props.hoverColor="hover:bg-gray-100"] - 버튼 hover 시 배경색
 * @returns {JSX.Element}
 */
const Pagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  pageButtonCount = 5,
  activeColor = "bg-green",
  hoverColor = "hover:bg-gray-100"
}) => {
  // 페이지 버튼 범위 계산
  let startPage = Math.max(0, currentPage - Math.floor(pageButtonCount / 2));
  let endPage = Math.min(totalPages - 1, startPage + pageButtonCount - 1);
  
  // 시작 페이지 재조정
  startPage = Math.max(0, Math.min(startPage, totalPages - pageButtonCount));
  
  // 페이지 버튼 목록 생성
  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`w-8 h-8 mx-1 rounded ${
          i === currentPage
            ? `${activeColor} text-white`
            : `bg-white text-gray-700 border border-gray-300 ${hoverColor}`
        }`}
        aria-label={`페이지 ${i + 1}`}
        aria-current={i === currentPage ? 'page' : undefined}
      >
        {i + 1}
      </button>
    );
  }
  
  return (
    <div className="flex justify-center items-center my-8">
      {/* 처음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(0)}
        disabled={!hasPrev}
        className={`w-8 h-8 mx-1 rounded ${
          !hasPrev
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : `bg-white text-gray-700 border border-gray-300 ${hoverColor}`
        }`}
        aria-label="첫 페이지"
      >
        &laquo;
      </button>
      
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`w-8 h-8 mx-1 rounded ${
          !hasPrev
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : `bg-white text-gray-700 border border-gray-300 ${hoverColor}`
        }`}
        aria-label="이전 페이지"
      >
        &lt;
      </button>
      
      {/* 페이지 버튼들 */}
      {pageButtons}
      
      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`w-8 h-8 mx-1 rounded ${
          !hasNext
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : `bg-white text-gray-700 border border-gray-300 ${hoverColor}`
        }`}
        aria-label="다음 페이지"
      >
        &gt;
      </button>
      
      {/* 마지막 페이지 버튼 */}
      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={!hasNext}
        className={`w-8 h-8 mx-1 rounded ${
          !hasNext
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : `bg-white text-gray-700 border border-gray-300 ${hoverColor}`
        }`}
        aria-label="마지막 페이지"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;