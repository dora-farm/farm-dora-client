import { useEffect, useState } from "react";
import Pagination from "../../common/components/Pagination";
import { fetchWithAuth } from '../../common/utils/fetchWithAuth';

const ProductQnA = ({ saleId }) => {
  const [qnaList, setQnaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [openQnaId, setOpenQnaId] = useState(null);

  useEffect(() => {
    fetchQnAList(currentPage);
  }, [currentPage]);

  const fetchQnAList = async (page) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_SEARCH_REST_API_URL}/sale/question/${saleId}?page=${page}`);
      const result = await response.json();

      if (result.status === 200) {
        setQnaList(result.data.contents);
        setCurrentPage(result.data.currentPage);
        setTotalPages(result.data.totalPages);
        setHasNext(result.data.hasNext);
        setHasPrev(result.data.hasPrevious);
      }
    } catch (error) {
      console.error("문의 목록 조회 실패:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleQna = (id) => {
    setOpenQnaId(openQnaId === id ? null : id);
  };

  return (
    <section className="product-qna p-4">
      <h2 className="text-xl font-semibold mb-4">상품 문의</h2>
      {qnaList.length > 0 ? (
        <ul className="space-y-3">
          {qnaList.map((qna) => (
            <li
              key={qna.id}
              className="border p-4 rounded-md cursor-pointer"
              onClick={() => toggleQna(qna.id)}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                <h3 className="font-semibold text-lg">{qna.title}</h3>
                <span className={`text-sm ${qna.process ? "text-green-600" : "text-red-500"}`}>
                  {qna.process ? "답변 완료" : "답변 대기"}
                </span>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-600">
                <p>작성자: {qna.writer}</p>
                <p className="text-xs text-gray-400">{new Date(qna.createdDate).toLocaleString()}</p>
              </div>

              {/* 문의 내용 및 답변 영역 */}
              {openQnaId === qna.id && (
                <div className="mt-3 space-y-3">
                  <div className="border rounded p-3 bg-gray-50">
                    <h4 className="font-semibold text-gray-800 mb-1">문의 내용</h4>
                    <p className="text-sm text-gray-700">{qna.content}</p>
                  </div>
                  {qna.process && (
                    <div className="border rounded p-3 bg-gray-50">
                      <h4 className="font-semibold text-gray-800 mb-1">답변</h4>
                      <p className="text-sm text-gray-700">{qna.answer}</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 text-sm py-10 border rounded bg-gray-50">
          문의 내역이 없습니다.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasPrev={hasPrev}
            hasNext={hasNext}
            pageButtonCount={5}
            activeColor="bg-green"
            hoverColor="hover:bg-gray-100"
          />
        </div>
      )}
    </section>
  );
};

export default ProductQnA;