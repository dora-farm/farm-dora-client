import React, { useState, useEffect } from 'react';
import Pagination from '../../common/components/Pagination'; // 적절한 경로로 수정 필요
import StarIcon from '@mui/icons-material/Star';

const ProductReviews = ({ saleId }) => {
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const toggleExpand = (reviewId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const fetchReviews = async (page = 0) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SEARCH_REST_API_URL}/sale/review/${saleId}?page=${page}`);
      const result = await response.json();
      setReviews(result.data.contents);
      setTotalElements(result.data.totalElements);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
      setHasNext(result.data.hasNext);
      setHasPrev(result.data.hasPrevious);
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
    }
  };

  const onPageChange = (page) => {
    fetchReviews(page);
  };

  useEffect(() => {
    fetchReviews(0);
  }, [saleId]);

  return (
    <section className="product-reviews w-full mt-12">
      <h3 className="text-2xl font-bold mb-6">
        상품 리뷰 <span className="text-green-600 text-lg ml-2">({totalElements})</span>
      </h3>
      {reviews.length > 0 ? (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div 
              key={review.reviewId} 
              className="border rounded-lg p-4 shadow cursor-pointer" 
              onClick={() => toggleExpand(review.reviewId)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-4">
                  {review.reviewFiles.length > 0 && (
                    <img
                      src={review.reviewFiles[0]}
                      alt="리뷰 대표 이미지"
                      className="w-20 h-20 object-contain bg-white rounded"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">{review.writer}</div>
                    <div className="text-sm text-gray-400">{new Date(review.createdDate).toLocaleString('ko-KR')}</div>
                    <div className="text-gray-800">{review.content}</div>

                    {/* 리뷰 파일 목록 */}
                    {review.reviewFiles.length > 1 && (
                      <>
                        {!expandedReviews[review.reviewId] && review.reviewFiles.length > 1 && (
                          <div className="text-sm text-gray-500 mt-2">
                            +{review.reviewFiles.length - 1}장의 사진 더 보기
                          </div>
                        )}
                        {expandedReviews[review.reviewId] && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {review.reviewFiles.slice(1).map((file, idx) => (
                              <img
                                key={idx}
                                src={file}
                                alt={`리뷰 이미지 ${idx + 2}`}
                                className="w-20 h-20 object-contain bg-white rounded"
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 text-lg">
                  <StarIcon fontSize="small" />
                  {review.score}
                </div>
              </div>
            </div>  
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-10 border rounded bg-gray-50">
          리뷰가 없습니다.
        </div>
      )}

      {/* 페이지네이션 추가 */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
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

export default ProductReviews;