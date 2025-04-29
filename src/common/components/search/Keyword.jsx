// src/components/Keyword.jsx
import React from 'react';

function Keyword({ searchTerm, setSearchTerm, sortFilter, setSortFilter, onKeyPress }) {
  return (
    <div className="flex items-center mb-3">
      <div className="w-24 font-medium">키워드</div>
      <input 
        type="text"
        placeholder="상품명을 입력하세요" 
        className="flex-grow border rounded px-3 py-2 mr-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={onKeyPress} // 여기에 onKeyDown 이벤트 핸들러 추가
      />
      <div className="ml-auto">
        <select
          className="border rounded px-3 py-2"
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value)}
        >
          <option value="LATEST">최신순</option>
          <option value="OLDEST">오래된 순</option>
        </select>
      </div>
    </div>
  );
}

export default Keyword;