import React, { useState, useEffect } from 'react';
import axios from '../../../common/utils/axiosInstance';
import Modal from '../../../common/components/Modal';

function PaymentInfo({ isOpen, onClose, orderId, orderData }) {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !orderId) return;
    
    if (orderData && orderData.paymentInfo) {
      setPaymentData(orderData.paymentInfo);
      return;
    }
    
    const fetchPaymentInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/my/user/order/pay?orderId=${orderId}`);
        
        if (response.data.status === 200) {
          setPaymentData(response.data.data);
        } else {
          setError(response.data.message || '결제 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('서버 연결에 문제가 발생했습니다: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [isOpen, orderId, orderData]);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 금액 포맷 함수
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return price.toLocaleString() + '원';
  };

  // 총 금액 계산 함수
  const calculateTotalAmount = (sales) => {
    if (!sales || !Array.isArray(sales)) return 0;
    
    return sales.reduce((total, sale) => {
      if (!sale.options || !Array.isArray(sale.options)) return total;
      
      const saleTotal = sale.options.reduce((optionTotal, option) => {
        return optionTotal + (option.price * option.quantity);
      }, 0);
      
      return total + saleTotal;
    }, 0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="결제 정보">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : paymentData ? (
        <div className="bg-white rounded-lg overflow-hidden overflow-y-auto">
          {/* 영수증 헤더 */}
          <div className="bg-green-50 p-4 border-b border-dashed border-gray-300 sticky top-0 z-10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-green-800">결제 영수증</h3>
              <span className="text-sm text-gray-500">#{paymentData.orderId}</span>
            </div>
            <p className="text-sm text-gray-600">{formatDate(paymentData.createDate)}</p>
            <p className="text-sm mt-1">상태: <span className="font-medium text-green-600">{paymentData.statusName}</span></p>
          </div>
          
          {/* 주문 상품 정보 - 각 상품별로 판매자 정보 포함 */}
          {paymentData.sales && paymentData.sales.length > 0 ? (
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold mb-3">주문 상품 ({paymentData.sales.length}개)</h4>
              
              {paymentData.sales.map((sale, index) => (
                <div key={sale.saleId} className={`mb-6 pb-4 ${index < paymentData.sales.length - 1 ? 'border-b border-gray-200 border-dashed' : ''}`}>
                  {/* 판매자 정보 */}
                  {sale.seller && (
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <div className="flex items-center">
                        <div>
                          <p className="font-medium text-lg">{sale.seller.companyName}</p>
                          <p className="text-xs text-gray-500">
                            {sale.seller.postNum} {sale.seller.addr} {sale.seller.detailAddr}
                          </p>
                          <p className="text-xs text-gray-500">
                            회사 번호 : {sale.seller.companyNum}
                          </p>
                          <p className="text-xs text-gray-500">                            
                            사업자 번호 : {sale.seller.phoneNum}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 상품 정보 */}
                  <div className="flex items-start mb-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      {sale.saveFile && (
                        <img 
                          src={`/images/products/${sale.saveFile}`} 
                          alt={sale.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{sale.title}</p>
                      <p className="text-xs text-gray-500">상품번호: {sale.saleId}</p>
                    </div>
                  </div>
                  
                  {/* 옵션 목록 */}
                  {sale.options && sale.options.length > 0 && (
                    <div className="ml-15 pl-15">
                      {sale.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex justify-between text-sm py-1 pl-4 border-l-2 border-gray-200">
                          <div className="flex-grow">
                            <span className="text-gray-700">{option.name}</span>
                            <span className="text-gray-500 ml-2">x{option.quantity}</span>
                          </div>
                          <div className="text-right font-medium">
                            {formatPrice(option.price * option.quantity)}
                          </div>
                        </div>
                      ))}
                      
                      {/* 상품별 소계 */}
                      <div className="flex justify-between text-sm py-1 pl-4 mt-1 font-medium">
                        <span className="text-gray-700">소계</span>
                        <span>
                          {formatPrice(sale.options.reduce((total, opt) => total + (opt.price * opt.quantity), 0))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 단일 상품일 경우
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold mb-2">주문 상품</h4>
              
              {/* 판매자 정보 */}
              {paymentData.sellerDetail && (
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      {paymentData.sellerDetail.saveFile && (
                        <img 
                          src={`/images/sellers/${paymentData.sellerDetail.saveFile}`} 
                          alt={paymentData.sellerDetail.companyName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{paymentData.sellerDetail.companyName}</p>
                      <p className="text-xs text-gray-500">
                        {paymentData.sellerDetail.postNum} {paymentData.sellerDetail.addr} {paymentData.sellerDetail.detailAddr}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 상품 정보 */}
              <div className="flex items-center mb-2">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                  {paymentData.saveFile && (
                    <img 
                      src={`/images/products/${paymentData.saveFile}`} 
                      alt={paymentData.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{paymentData.title}</p>
                  <p className="text-sm text-gray-500">상품번호: {paymentData.saleId}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* 결제 정보 */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold mb-2">결제 정보</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">결제 방법:</div>
                <div className="font-medium">{paymentData.payDetail.payMethod}</div>
                
                <div className="text-gray-500">결제 상태:</div>
                <div className="font-medium text-green-600">{paymentData.payDetail.payStatus}</div>
                
                <div className="text-gray-500">결제 번호:</div>
                <div className="font-medium">{paymentData.payDetail.payNum}</div>
                
                {paymentData.payDetail.card && (
                  <>
                    <div className="text-gray-500">카드사:</div>
                    <div className="font-medium">{paymentData.payDetail.card}</div>
                    
                    <div className="text-gray-500">카드번호:</div>
                    <div className="font-medium">{paymentData.payDetail.cardNumber}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* 결제 금액 */}
          <div className="p-4 bg-gray-50">
            {/* 여러 상품이 있는 경우 판매별 금액 세부 정보 */}
            {paymentData.sales && paymentData.sales.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium mb-1 text-gray-700">판매별 금액</div>
                {paymentData.sales.map((sale) => {
                  const saleTotal = sale.options.reduce((total, opt) => total + (opt.price * opt.quantity), 0);
                  return (
                    <div key={sale.saleId} className="flex justify-between items-center py-1 text-sm">
                      <span className="text-gray-600 truncate max-w-[70%]">{sale.title}</span>
                      <span>+ {formatPrice(saleTotal)}</span>
                    </div>
                  );
                })}
                <div className="border-t border-dashed border-gray-200 my-2"></div>
              </div>
            )}
            
            {/* 금액 합계 */}
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">상품 금액</span>
              <span>
                {paymentData.sales 
                  ? formatPrice(calculateTotalAmount(paymentData.sales))
                  : formatPrice(paymentData.payDetail.amount)
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-1 text-sm text-gray-500">
              <span>배송비</span>
              <span>무료</span>
            </div>
            <div className="border-t border-gray-300 border-dashed my-2"></div>
            <div className="flex justify-between items-center py-1 font-bold text-lg">
              <span>총 결제금액</span>
              <span className="text-green-600">{formatPrice(paymentData.payDetail.amount)}</span>
            </div>
          </div>
          
          {/* 버튼 */}
          <div className="flex justify-center p-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              확인
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-4">데이터가 없습니다.</div>
      )}
    </Modal>
  );
}

export default PaymentInfo;