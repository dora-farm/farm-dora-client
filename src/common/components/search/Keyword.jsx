// src/components/Keyword.jsx
import React from 'react';

function Keyword({ searchTerm, setSearchTerm, sortFilter, setSortFilter, inputRef }) {
  return (
    <div className="flex items-center mb-3">
      <div className="w-24 font-medium">키워드</div>
      <input 
        ref={inputRef}
        type="text"
        placeholder="검색어를 입력하세요" 
        className="flex-grow border rounded px-3 py-2 mr-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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