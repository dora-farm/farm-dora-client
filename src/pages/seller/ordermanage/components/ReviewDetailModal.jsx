import React, { useState, useEffect } from "react";
import axios from "../../../../common/utils/axiosInstance";
import ClearIcon from "@mui/icons-material/Clear";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import Rating from "@mui/material/Rating";
import CircularProgress from '@mui/material/CircularProgress';

const ReviewDetailModal = ({ review, detail, loading, isOpen, onClose, onUpdateReview }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("review");
  const [imageErrors, setImageErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [replyText, setReplyText] = useState("");

  // 답변 수정 모드 활성화
  const handleEditMode = () => {
    setReplyText(review?.reply || "");
    setIsEditMode(true);
  };
  // 답변 수정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveReply = async (review) => {
    try {
      setIsLoading(true);
      
      console.log({
        reviewId: review.reviewId,
        reply: replyText
      });

      const response = await axios.put(
        `${import.meta.env.VITE_ACTIVITY_REST_API_URL}/api/my/seller/order/review/update`, {
          reviewId: review.reviewId,
          reply: replyText
        }
      );

      if (response.status === 200) {
        const updateReview = { ...review, reply: replyText };

        if (typeof onUpdateReview === 'function') {
          onUpdateReview(updateReview);
        }
      }
      setIsEditMode(false);

    } catch (error) {
      console.log("답변 저장 중 오류 발생", error);

    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl">
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <div className="text-gray-700 font-medium">상세 정보를 불러오는 중입니다...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 이미지 URL 포맷팅
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const baseUrl = "https://zcbg41sa9729.edge.naverncp.com/O8XfcLSSm6/review/";
    const params = "?type=m&w=220&h=180";

    return imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath}${params}`;
  };

  // 이미지 로드 에러 핸들링
  const handleImageError = (fileIndex) => {
    setImageErrors((prev) => ({ ...prev, [fileIndex]: true }));
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center z-50 select-none ${
        isVisible ? "bg-opacity-60" : "bg-opacity-0"
      } ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden transition-transform duration-300 shadow-2xl ${
          isVisible ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 섹션 */}
        <div className="bg-brown text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <RateReviewIcon className="mr-2" />
            리뷰 상세 정보
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <ClearIcon />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("review")}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "review"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <RateReviewIcon className="mr-2" fontSize="small" />
              리뷰 내용
            </button>
            
            <button
              onClick={() => setActiveTab("reply")}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "reply"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <CommentIcon className="mr-2" fontSize="small" />
              답변 관리
            </button>
            
            <button
              onClick={() => setActiveTab("product")}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "product"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ShoppingBagIcon className="mr-2" fontSize="small" />
              상품 정보
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* 리뷰 내용 탭 */}
          {activeTab === "review" && (
            <div className="space-y-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">리뷰 정보</h3>
                  <div className="text-sm text-gray-500">
                    작성일자: {formatDate(review?.createdDate)}
                  </div>
                </div>
                
                <div className="bg-amber-50 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
                  <div className="text-amber-900 text-sm flex items-center">
                    <PersonIcon className="mr-2" fontSize="small" />
                    작성자: <span className="font-semibold ml-1">{review?.writer || "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-amber-900 text-sm mr-2">별점:</span>
                    <Rating
                      value={review?.score || 0}
                      readOnly
                      size="small"
                      precision={1}
                      sx={{
                        color: '#1CA673',
                        '& .MuiRating-iconEmpty': {
                          color: '#E5E7EB',
                          stroke: '#1CA673',
                          strokeWidth: 0.5
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">리뷰 내용</div>
                  <div className="bg-gray-50 p-4 rounded-md text-gray-700 min-h-[100px]">
                    {review?.reply || "-"}
                  </div>
                </div>
                
                {/* 사진 목록 */}
                {Array.isArray(detail) && detail.length > 0 ? (
                  <div className="mt-6">
                    <div className="text-sm text-gray-500 mb-3">첨부 사진</div>
                    <div className="grid grid-cols-2 gap-4">
                      {detail.map((item, index) => (
                        <div 
                          key={`file-${index}`}
                          className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                          {!imageErrors[index] ? (
                            <img
                              src={formatImageUrl(item.saveFile)}
                              alt={`리뷰 이미지 ${index + 1}`}
                              className="w-full h-48 object-cover"
                              onError={() => handleImageError(index)}
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                              <div className="text-gray-400 text-sm">이미지를 불러올 수 없습니다</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="text-sm text-gray-500 mb-1">첨부 사진</div>
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <div className="text-gray-500">첨부된 사진이 없습니다.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 상품 정보 탭 */}
          {activeTab === "product" && (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">상품 정보</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="h-20 w-20 bg-gray-100 rounded-md mr-4 flex items-center justify-center overflow-hidden">
                        {detail?.saveFile ? (
                          <img 
                            src={formatImageUrl(detail.saveFile)} 
                            alt="상품 이미지" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/default-product.png';
                            }}
                          />
                        ) : (
                          <ShoppingBagIcon style={{ color: '#9CA3AF', fontSize: 32 }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{review?.saleTitle || "-"}</h4>
                        <div className="text-sm text-gray-500">
                          주문 번호: {Array.isArray(detail) && detail.length > 0 ? detail[0].orderId : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 답변 관리 탭 */}
          {activeTab === "reply" && (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">답변 관리</h3>
                
                {review?.reply ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="mb-3 flex justify-between">
                      <div className="text-sm text-gray-500">등록된 답변</div>
                    </div>
                    {isEditMode ? (
                      <textarea 
                        className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                    ) : (
                      // 일반 모드일 때 div 표시
                      <div className="bg-gray-50 p-4 rounded-md text-gray-700 min-h-[100px]">
                        {review.reply}
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      {isEditMode ? (
                        // 편집 모드일 때 표시할 버튼들
                        <>
                          <button 
                            onClick={() => handleSaveReply(review)}
                            disabled={isLoading}
                            className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition-colors flex items-center justify-center"
                          >
                            {isLoading ? (
                              <>
                                <CircularProgress 
                                  size={16}
                                  thickness={4}
                                  sx={{ color: 'white', marginRight: '8px' }}
                                />
                                저장 중...
                              </>
                            ) : '저장'}
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        // 일반 모드일 때 표시할 버튼들
                        <>
                          <button 
                            onClick={handleEditMode}
                            className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition-colors"
                          >
                            답변 수정
                          </button>
                          <button className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors">
                            답변 삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">답변 작성</div>
                    </div>
                    <textarea 
                      autoFocus 
                      className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="답변을 작성해주세요..."
                    />
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition-colors">
                        답변 등록
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-amber-50 rounded-lg text-sm text-amber-800">
                  <div className="font-medium mb-1">안내사항</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>답변은 고객에게 즉시 표시됩니다.</li>
                    <li>부적절한 내용은 사이트 정책에 따라 제재될 수 있습니다.</li>
                    <li>고객 문의에 24시간 이내 답변을 권장합니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;