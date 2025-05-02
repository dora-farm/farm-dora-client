import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

// refund 매개변수 추가
const OrderDetailModal = ({ order, detail, refund, loading, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("product");
  const [imageErrors, setImageErrors] = useState({});

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

  // refund가 있으면 기본 탭을 refund로 설정
  useEffect(() => {
    if (refund) {
      setActiveTab("refund");
    } else {
      setActiveTab("product");
    }
  }, [refund]);

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

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "-";
    return price.toLocaleString() + "원";
  };

  // 총 상품 가격 계산
  const calculateTotalPrice = () => {
    if (!order || !order.products) return 0;
    
    return order.products.reduce((total, product) => {
      if (!product.options) return total;
      
      const productTotal = product.options.reduce(
        (sum, option) => sum + option.price,
        0
      );
      
      return total + productTotal;
    }, 0);
  };

  // 모달 타이틀 설정
  const getModalTitle = () => {
    if (refund) {
      return "환불/교환 상세 정보";
    }
    return "주문 상세 정보";
  };

  // 이미지 URL 포맷팅
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const baseUrl = "https://zcbg41sa9729.edge.naverncp.com/O8XfcLSSm6/wishlist/";
    const params = "?type=f&w=700&h=700&quality=90&align=4";

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
        {/* 헤더 섹션 - 좀 더 눈에 띄게 */}
        <div className="bg-brown text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <ReceiptIcon className="mr-2" />
            {getModalTitle()}
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
            {/* 환불 정보 탭 (refund가 있을 때만 표시) */}
            {refund && (
              <button
                onClick={() => setActiveTab("refund")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "refund"
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <AssignmentReturnIcon className="mr-2" fontSize="small" />
                환불 정보
              </button>
            )}
            
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
            
            <button
              onClick={() => setActiveTab("shipping")}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "shipping"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <LocalShippingIcon className="mr-2" fontSize="small" />
              배송지 정보
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* 환불 정보 탭 */}
          {activeTab === "refund" && refund && (
            <div className="space-y-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">환불 정보</h3>
                  <div className="text-sm text-gray-500">
                    접수일자: {formatDate(refund.createdDate)}
                  </div>
                </div>
                <div className="bg-amber-50 px-4 py-3 rounded-lg mb-4 text-amber-900 text-sm">
                  환불 유형: <span className="font-semibold">{refund.typeName || "-"}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">환불 사유</div>
                  <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                    {refund.content || "-"}
                  </div>
                </div>
                
                {/* 사진 목록 */}
                {refund.files && refund.files.length > 0 ? (
                  <div className="mt-6">
                    <div className="text-sm text-gray-500 mb-3">첨부 사진</div>
                    <div className="grid grid-cols-2 gap-4">
                      {refund.files.map((file, index) => (
                        <div 
                          key={`file-${index}`}
                          className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                          {!imageErrors[index] ? (
                            <img
                              src={formatImageUrl(file)}
                              alt={`환불 이미지 ${index + 1}`}
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
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">상품 목록</h3>
                  <div className="text-sm text-gray-500">
                    주문일자: {formatDate(order?.createdDate)}
                  </div>
                </div>
                <div className="bg-amber-50 px-4 py-3 rounded-lg mb-2 text-amber-900 text-sm">
                  주문 상태: <span className="font-semibold">{order?.orderStatus || "-"}</span>
                </div>
              </div>

              <div className="space-y-4">
                {order && order.products && order.products.length > 0 ? (
                  order.products.map((product, productIndex) => (
                    <div
                      key={`product-${product.saleId}-${productIndex}`}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        {/* 옵션 섹션 */}
                        <div className="mt-3">
                          <div className="bg-gray-50 py-2 px-3 rounded-t-md border border-gray-200">
                            <div className="grid grid-cols-3 text-sm font-medium text-gray-600">
                              <div>옵션명</div>
                              <div>수량</div>
                              <div>가격</div>
                            </div>
                          </div>
                          <div className="border-x border-b border-gray-200 rounded-b-md overflow-hidden">
                            {product.options &&
                              product.options.map((option, optionIndex) => (
                                <div
                                  key={`option-${option.optionId}-${optionIndex}`}
                                  className="grid grid-cols-3 py-2 px-3 text-sm"
                                >
                                  <div className="font-medium text-gray-700">{option.name}</div>
                                  <div>{option.count}개</div>
                                  <div className="font-semibold text-amber-700">
                                    {formatPrice(option.price)}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-gray-500">상품 정보가 없습니다.</div>
                  </div>
                )}
              </div>

              {/* 총 결제금액 */}
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">총 결제금액</span>
                  <span className="text-xl font-bold text-amber-700">
                    {formatPrice(order?.totalPrice || calculateTotalPrice())}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 배송 정보 탭 */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">배송 정보</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">주문자</div>
                      <div className="font-medium text-gray-800">{detail.userName || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">연락처</div>
                      <div className="font-medium text-gray-800">{detail.phoneNum || "-"}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-500 mb-1">배송지</div>
                    <div className="bg-gray-50 rounded-md p-3 flex items-start mt-1">
                      <LocationOnIcon className="text-amber-600 mr-2 mt-1" />
                      <div>
                        {detail.address?.postNum && (
                          <div className="text-xs text-gray-500 mb-1">
                            우편번호: {detail.address.postNum}
                          </div>
                        )}
                        <div className="font-medium text-gray-800">{detail.address?.addr || "-"}</div>
                        <div className="text-gray-600 text-sm mt-1">
                          {detail.address?.detailAddr || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;