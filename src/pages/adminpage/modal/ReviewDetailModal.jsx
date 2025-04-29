import React from 'react';
import { X } from 'lucide-react';
import Loading from '../../../common/components/Loading';

function ReviewDetailModal({ isOpen, onClose, reviewDetail, loading, onDelete }) {
  if (!isOpen) return null;
  
  // 별점 렌더링 함수
  const renderStars = (score) => {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-medium">리뷰 상세 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loading />
          </div>
        ) : reviewDetail ? (
          <>
            {/* 상품 정보 */}
            <div className="p-4 border-b">
              <div className="flex">
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-3">
                  <img 
                    src={reviewDetail.productImage} 
                    alt={reviewDetail.productName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <p className="font-medium">{reviewDetail.productName}</p>
                  <p className="text-sm text-gray-500 mt-1">상품 ID: {reviewDetail.saleId}</p>
                  <p className="text-sm text-gray-500 mt-1">리뷰 ID: {reviewDetail.reviewId}</p>
                </div>
              </div>
            </div>
            
            {/* 리뷰 정보 */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">작성자 정보</div>
                <div className="text-sm text-gray-500">
                  {new Date(reviewDetail.createdDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">{reviewDetail.userName}</div>
                <div className="text-green">{renderStars(reviewDetail.score)}</div>
              </div>
            </div>
            
            {/* 주문 옵션 */}
            {reviewDetail.orderOptions && reviewDetail.orderOptions.length > 0 && (
              <div className="p-4 border-b">
                <div className="font-medium mb-2">주문 옵션</div>
                {reviewDetail.orderOptions.map((option, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span>{option.optionName}</span>
                    <span>{option.quantity}개 ({option.price.toLocaleString()}원)</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* 리뷰 내용 */}
            <div className="p-4 border-b">
              <div className="font-medium mb-2">리뷰 내용</div>
              <div className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">
                {reviewDetail.content}
              </div>
            </div>
            
            {/* 리뷰 이미지 */}
            {reviewDetail.imageUrls && reviewDetail.imageUrls.length > 0 && (
              <div className="p-4 border-b">
                <div className="font-medium mb-2">첨부 이미지</div>
                <div className="flex flex-wrap gap-2">
                  {reviewDetail.imageUrls.map((url, index) => (
                    <div key={index} className="w-16 h-16 border border-gray-300 rounded overflow-hidden">
                      <img 
                        src={url} 
                        alt={`리뷰 이미지 ${index + 1}`} 
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => window.open(url, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 삭제 버튼 */}
            <div className="p-4 flex justify-end">
              <button
                onClick={() => onDelete(reviewDetail.reviewId)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
              >
                리뷰 삭제
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            리뷰 정보를 불러올 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewDetailModal;