import React, { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// 상품 상세 정보를 보여주는 모달 컴포넌트
const ProductDetailModal = ({ isOpen, onClose, productDetail, loading }) => {
  const modalRef = useRef(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // ESC 키 누를 때 모달 닫기
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-10"
      >
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">상품 상세 정보</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 모달 본문 */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : productDetail ? (
            <div className="space-y-8">
              {/* 카테고리 정보 */}
              <div>
                <h3 className="text-lg font-medium mb-4">카테고리</h3>
                <div className="flex gap-4">
                  <div className="w-1/2 border p-3 rounded bg-gray-50">
                    <span className="font-medium">대분류:</span> {productDetail.bigCategory}
                  </div>
                  <div className="w-1/2 border p-3 rounded bg-gray-50">
                    <span className="font-medium">소분류:</span> {productDetail.smallCategory}
                  </div>
                </div>
              </div>
              
              {/* 상품명 및 원산지 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">상품명</h3>
                  <div className="border p-3 rounded bg-gray-50">
                    {productDetail.title}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">원산지</h3>
                  <div className="border p-3 rounded bg-gray-50">
                    {productDetail.origin}
                  </div>
                </div>
              </div>
              
              {/* 옵션 정보 */}
              <div>
                <h3 className="text-lg font-medium mb-2">옵션</h3>
                <div className="border rounded">
                  <div className="grid grid-cols-12 gap-4 p-3 border-b bg-gray-100 font-medium">
                    <div className="col-span-4">옵션명</div>
                    <div className="col-span-4">가격</div>
                    <div className="col-span-4">재고</div>
                  </div>
                  <div className="divide-y">
                    {productDetail.options && productDetail.options.map((option, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 p-3">
                        <div className="col-span-4">{option.name}</div>
                        <div className="col-span-4">{option.price}원</div>
                        <div className="col-span-4">{option.quantity}개</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 이미지 섹션 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 대표 이미지 */}
                <div>
                  <h3 className="text-lg font-medium mb-3">대표 이미지</h3>
                  <div className="border rounded p-3 bg-gray-50">
                    {productDetail.mainImage ? (
                      <img 
                        src={productDetail.mainImage} 
                        alt="대표 이미지" 
                        className="w-full h-48 object-contain mx-auto"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                        이미지 없음
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 상세 이미지 */}
                <div>
                  <h3 className="text-lg font-medium mb-3">상세 이미지</h3>
                  <div className="border rounded p-3 bg-gray-50 h-48 overflow-auto">
                    <div className="flex flex-wrap gap-2">
                      {productDetail.detailImages && productDetail.detailImages.length > 0 ? (
                        productDetail.detailImages.map((image, index) => (
                          <div key={index} className="w-20 h-20">
                            <img 
                              src={image} 
                              alt={`상세 이미지 ${index + 1}`} 
                              className="w-full h-full object-cover border"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center text-gray-500">
                          등록된 상세 이미지가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 상세 설명 */}
              <div>
                <h3 className="text-lg font-medium mb-2">상세 설명</h3>
                <div className="border rounded bg-gray-50 p-1">
                  <div 
                    className="ck-content p-4" 
                    dangerouslySetInnerHTML={{ __html: productDetail.content }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              상품 정보를 불러올 수 없습니다.
            </div>
          )}
        </div>
        
        {/* 모달 푸터 */}
        <div className="flex justify-end p-4 border-t">
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;