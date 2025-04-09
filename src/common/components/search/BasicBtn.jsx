import React from 'react';

const BasicBtn = ({handleSearch, handleReset}) => {
    return (
        <div className="flex justify-center gap-3">
          <button 
            onClick={handleSearch}
            className="w-28 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded"
          >
            검색
          </button>
          <button 
            onClick={handleReset}
            className="w-28 border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded"
          >
            초기화
          </button>
        </div>
    );
};

export default BasicBtn;