import React from 'react';
import Rating from '@mui/material/Rating';

function ReviewTable({ reviews, isLoading, onReviewClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">NO</th>
            <th className="p-2 border">상품명</th>
            <th className="p-2 border">리뷰 내용</th>
            <th className="p-2 border">작성일</th>
            <th className="p-2 border">작성자</th>
            <th className="p-2 border">별점</th>
          </tr>
        </thead>
        <tbody>
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewTableRow 
                key={review.reviewId} 
                review={review} 
                onReviewClick={onReviewClick} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                {isLoading ? '데이터를 불러오는 중입니다...' : '검색 결과가 없습니다.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// 테이블 행 컴포넌트
function ReviewTableRow({ review, onReviewClick }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border text-center">
        {review.reviewId}
      </td>
      <td className="p-2 border">{review.productName}</td>
      <td 
        className="p-2 border cursor-pointer text-blue-600 hover:underline"
        onClick={() => onReviewClick(review.reviewId)}
      >
        {review.content && review.content.length > 10 ? review.content.substring(0, 20) + '...' : review.content}
      </td>
      <td className="p-2 border text-center">
        {review.createdDate && new Date(review.createdDate).toLocaleDateString()}
      </td>
      <td className="p-2 border text-center">{review.userName}</td>
      <td className="p-2 border text-center">
        <div className="flex justify-center">
          <Rating 
            value={review.score} 
            readOnly 
            size="medium" 
            precision={0.5}
            sx={{ 
              color: '#1CA673', // 초록색 별점
              '& .MuiRating-iconEmpty': {
                color: '#E5E7EB' // 빈 별 색상
              } 
            }}
          />
        </div>
      </td>                  
    </tr>
  );
}

export default ReviewTable;