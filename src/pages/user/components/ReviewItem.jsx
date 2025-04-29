import React from 'react';
import Rating from '@mui/material/Rating'; // Material-UI Rating import 추가

function ReviewItem({ review, onOpenImageViewer, onEditReview, onDeleteReview }) {
  // 별점에 따른 메시지
  const ratingMessages = {
    1: '1점',
    2: '2점',
    3: '3점',
    4: '4점',
    5: '5점'
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
  };

  return (
    <div className="border border-gray-200 rounded overflow-hidden mb-4">
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="font-bold">
            <span className="text-green ">#{review.reviewId + " "}</span>
            {formatDate(review.createdDate)}
          </div>
          <div className="flex items-center">
            <Rating
              value={review.score}
              readOnly
              size="medium"
              precision={1}
              sx={{
                color: '#1CA673', // 초록색 별점
                '& .MuiRating-iconEmpty': {
                  color: '#E5E7EB' // 빈 별 색상
                }
              }}
            />
            <span className="ml-2 text-gray-500">
              {ratingMessages[review.score] || `${review.score}점`}
            </span>
          </div>
        </div>
        <div className="flex col">
          <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded">
            <img 
              src={review.productImage}
              alt="아직 사진 등록안함"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-7">
            <div className="text-gray-600 text-sm">상품명: {review.productName}</div>
            {/* 주문 옵션 정보 */}
            <div className="mt-5 text-sm text-gray-600">
              <div className="font-semibold mb-1">주문 옵션:</div>
              {review.orderOptions && review.orderOptions.map((option) => (
                <div key={option.optionId} className="ml-2">
                  {option.optionName} {option.quantity}개 
                  <span className="text-xs text-gray-500 ml-1">({option.price.toLocaleString()}원)</span>
                </div>
              ))}
            </div>
          </div>
        </div>   
      </div>
      <div className="p-4 flex">
        <div className="ml-4 flex-1">
          {/* 리뷰 내용 */}
          <div className="text-gray-800 mt-1">
            {review.content}
          </div>
          
          {/* 리뷰 이미지 */}
          {review.imageUrls && review.imageUrls.length > 0 && (
            <div className="mt-3">
              <div className="flex space-x-2 relative">
                {/* 첫 번째 이미지는 항상 표시 */}
                <div 
                  className="relative w-20 h-20 cursor-pointer overflow-hidden rounded border border-gray-200"
                  onClick={() => onOpenImageViewer(review.imageUrls, 0)}
                >
                  <img 
                    src={review.imageUrls[0]} 
                    alt="리뷰 이미지" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 두 번째 이미지부터는 겹치게 표시 */}
                {review.imageUrls.length > 1 && (
                  <div 
                    className="relative w-20 h-20 cursor-pointer overflow-hidden rounded border border-gray-200 -ml-6"
                    onClick={() => onOpenImageViewer(review.imageUrls, 1)}
                  >
                    <img 
                      src={review.imageUrls[1]} 
                      alt="리뷰 이미지" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 3장 이상일 경우 몇 장인지 표시 */}
                    {review.imageUrls.length > 2 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                        +{review.imageUrls.length - 1}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          
        </div>
        
        <div className="ml-7 flex flex-col items-end space-y-3">
          <button 
            className="px-3 py-1 border border-gray-dark rounded hover:bg-gray-300 transition-colors text-gray-700 text-sm"
            onClick={() => onEditReview(review.reviewId, review)}
          >
            리뷰 수정
          </button>
          <button 
            className="px-3 py-1 bg-danger text-white rounded text-sm hover:bg-danger-dark transition-colors"
            onClick={() => {
              if (window.confirm('리뷰를 삭제하시겠습니까?')) {
                onDeleteReview(review.reviewId);
              }
            }}
          >
            리뷰 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewItem;