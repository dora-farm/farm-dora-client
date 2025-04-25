import React, { useCallback, useState } from "react";
import DateFilter from "./components/DateFilter";
import Pagination from "../../common/components/Pagination";

function MyInquireies() {

  // 임시 더미 데이터
  const inquiries = [
    { id: 1, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 2, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 3, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 4, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 5, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 6, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 7, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 8, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 9, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 10, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 11, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 12, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 13, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 14, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 15, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 16, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 17, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 18, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 19, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 20, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 21, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 22, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 23, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 24, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 25, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 26, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 27, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 28, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 29, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
    { id: 30, title: "문의제목", createdAt: "2025.03.26 16:00", processed: "Y" },
  ];

  // 날짜 필터
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  });

  const [selectedRange, setSelectedRange] = useState("all");

  const handleRangeUpdate = (newRange, newSelected) => {
    setDateRange(newRange);
    setSelectedRange(newSelected);
  };

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 10;
  const totalPages = Math.ceil(inquiries.length / itemPerPage);
  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  const paginatedInquiries = inquiries.slice(
    currentPage * itemPerPage,
    currentPage * itemPerPage + itemPerPage
  );
  console.log(paginatedInquiries)
  const onPageChange = useCallback((newPage) => {
    setCurrentPage(newPage)
  }, []);

  return (
    <div className="w-full m-7">
      <h1 className="text-2xl font-bold text-center pb-5">
        내 문의 내역
      </h1>

      <DateFilter
        dateRange={dateRange}
        selectedRange={selectedRange}
        onRangeUpdate={handleRangeUpdate}
      />

      {/* 리스트 테이블 */}
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow">
        <table className="w-full text-center">
          <thead className="bg-gray-50">
            <tr className="">
              <th className="py-3 px-4 border-b">번호</th>
              <th className="py-3 px-4 border-b">제목</th>
              <th className="py-3 px-4 border-b">작성일</th>
              <th className="py-3 px-4 border-b">답변여부</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInquiries.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{item.id}</td>
                <td className="py-3 px-4 border-b">{item.title}</td>
                <td className="py-3 px-4 border-b">{item.createdAt}</td>
                <td className="py-3 px-4 border-b">{item.processed}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </div>
    </div>
  );
}

export default MyInquireies;
