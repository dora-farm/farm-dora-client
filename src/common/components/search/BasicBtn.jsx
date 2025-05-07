import React from 'react';

const BasicBtn = ({handleSearch, handleReset}) => {
    return (
        <div className="flex justify-center gap-6">
          <button 
            onClick={handleSearch}
            className="w-24 bg-gray-700 text-sm hover:bg-gray-800 text-white py-2 px-4 rounded"
          >
            검색
          </button>
          <button 
            onClick={handleReset}
            className="w-24 border text-sm bg-white border-gray-300 hover:bg-gray-50 py-2 px-4 rounded"
          >
            초기화
          </button>
        </div>
    );
};

export default BasicBtn;