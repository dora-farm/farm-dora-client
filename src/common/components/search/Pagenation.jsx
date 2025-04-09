import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagenation = ({totalCount, itemsPerPage, currentPage, handlePageChange}) => {
    return (
        <div className="flex justify-center">
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={Math.ceil(totalCount / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={'flex gap-1 items-center'}
            pageClassName={'border px-3 py-1 cursor-pointer hover:bg-gray-100'}
            previousClassName={'border px-3 py-1 cursor-pointer hover:bg-gray-100'}
            nextClassName={'border px-3 py-1 cursor-pointer hover:bg-gray-100'}
            breakClassName={'px-2'}
            activeClassName={'bg-red-700 text-white hover:bg-red-800'}
            forcePage={currentPage}
            renderOnZeroPageCount={null}
          />
        </div>
    );
};

export default Pagenation;