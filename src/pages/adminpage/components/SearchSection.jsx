import Keyword from '../../../common/components/search/Keyword';
import BasicBtn from '../../../common/components/search/BasicBtn';

function SearchSection({ 
  searchTerm, 
  setSearchTerm, 
  searchType, 
  setSearchType, 
  sortFilter, 
  setSortFilter,
  handleSearch,
  handleReset
}) {
  // 엔터 키 처리 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // 검색 타입 변경 핸들러
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      {/* 검색창 */}
      <div className="flex flex-wrap items-center mb-4 justify-between">
        {/* 키워드 검색창 */}
        <div className="flex-grow">
          <Keyword 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            sortFilter={sortFilter} 
            setSortFilter={setSortFilter}
            onKeyPress={handleKeyPress}
          />
        </div>
        {/* 검색 타입 선택 */}
        <div className="ml-auto mb-3">
          <select 
            className="border rounded py-2 px-3 ml-3"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="PRODUCT_NAME">상품명</option>
            <option value="WRITER">작성자명</option>
          </select>
        </div>
      </div>
      
      <BasicBtn 
        handleSearch={handleSearch} 
        handleReset={handleReset}
      />
    </div>
  );
}

export default SearchSection;