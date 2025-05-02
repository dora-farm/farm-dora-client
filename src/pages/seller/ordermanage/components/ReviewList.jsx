import React from "react";
import Rating from '@mui/material/Rating';

const ReviewList = ({reviews = [], loading = false, error = null, onReviewClick = () => {} }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">주문 내역이 없습니다.</div>
      </div>
    );
  }
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left border-b border-gray-300 select-none">
        <thead className="bg-brown text-white">
          <tr>
            <th className="border px-2 py-2 w-[5%] text-center">No.</th>
            <th className="border px-2 py-2 w-[10%] text-center">작성자</th>
            <th className="border px-2 py-2 w-[15%] text-center">상품명</th>
            <th className="border px-2 py-2 w-[35%] text-center">내용</th>
            <th className="border px-2 py-2 w-[15%] text-center">작성시간</th>
            <th className="border px-2 py-2 w-[12%] text-center">별점</th>
            <th className="border px-2 py-2 w-[8%] text-center">답변</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr 
              key={review.reviewId} 
              className="hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onReviewClick(review)}
            >
              <td className="border-b border-gray-300 px-5 py-4 text-center text-sm font-medium">
                {review.reviewId}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
                {review.writer}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
              {review.saleTitle}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
              {review.reviewContent}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm font-medium">
              {formatDate(review.createdDate)}
              </td>
              <td className={"border-b border-gray-300 px-4 py-4 text-center text-sm font-medium"}>
                <Rating
                  value={review.score}
                  readOnly
                  size="small"
                  precision={1}
                  sx={{
                    color: '#1CA673', // 채워진 별 색상
                    '& .MuiRating-iconEmpty': {
                      color: '#E5E7EB', // 빈 별 색상
                      stroke: '#1CA673', // 빈 별 테두리 색상
                      strokeWidth: 0.5 // 테두리 두께
                    }
                  }}
                />
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm font-medium">
              {review.reply}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewList;