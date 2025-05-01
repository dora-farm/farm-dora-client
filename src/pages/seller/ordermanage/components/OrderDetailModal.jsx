import React, { useState, useEffect } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import LocationOnIcon from '@mui/icons-material/LocationOn';


const OrderDetailModal = ({ order, detail, loading, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

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
    // 애니메이션 시간만큼 지연 후 실제 닫기 함수 호출
    setTimeout(() => {
      onClose();
    }, 300); // 트랜지션 시간과 일치시킴 (300ms)
  };

  if (!isOpen) return null;
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <div className="flex justify-center items-center p-8">
            <div className="text-gray-500">상세 정보를 불러오는 중입니다...</div>
          </div>
        </div>
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

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "-";
    return price.toLocaleString() + '원';
  };

  const formatProductTitle = (order) => {
    if (!order.products) return "-";
    
    // products가 배열인 경우
    if (Array.isArray(order.products)) {
      if (order.products.length === 0) return "-";
      if (order.products.length === 1) return order.products[0].saleTitle || "-";
      return `${order.products[0].saleTitle} 외 ${order.products.length - 1}건`;
    }
    
    // products가 객체인 경우 (이미 변환된 데이터)
    return order.products.saleTitle || "-";
  };

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center z-50 ${
        isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
          isVisible ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블링 방지
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">주문 상세 정보</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <ClearIcon />
          </button>
        </div>
        
        <div className="pb-4 mb-8">
          <h3 className="font-bold mb-4">주문 기본 정보</h3>
          <div className="border-2 p-3 rounded-lg flex flex-col space-y-2">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-gray-600">주문자</div>
              <div>{detail.userName || "-"}</div>
              <div className="text-gray-600">전화번호</div>
              <div>{detail.phoneNum}</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-gray-600">주소</div>
              <div className="text-left col-span-3">
                <div className="text-left col-span-3 flex items-center p-2">
                  <LocationOnIcon />
                  <div className="ml-4">
                    {detail.address.postNum && (
                      <div className="text-gray-500 text-xs mt-1">우편번호: {detail.address.postNum}</div>
                    )}
                    <span className="font-medium">{detail.address.addr}</span>
                    <span className="text-gray-600 text-sm">{detail.address.detailAddr}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pb-4 mb-4">
          <h3 className="font-bold mb-2">상품 정보</h3>
          <div className="space-y-4">
            <div className="border-2 p-3 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                {/* 상품명 섹션 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">상품명</div>
                  <div>-</div>
                </div>
                
                {/* 옵션 섹션 */}
                <div>
                  <div className="text-gray-600 mb-2 font-medium">옵션</div>
                  <div className="ml-2 pl-3 border-gray-200">
                    {/* 옵션 항목들 */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="text-gray-600">옵션명</div>
                      <div className="text-gray-600">수량</div>
                      <div className="text-gray-600">가격</div>
                    </div>
                    
                    {/* 옵션 값 (여러 개일 경우 map으로 반복) */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>옵션 A</div>
                      <div>2개</div>
                      <div>10,000원</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>옵션 B</div>
                      <div>1개</div>
                      <div>5,000원</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="text-gray-500">상품 정보가 없습니다.</div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;