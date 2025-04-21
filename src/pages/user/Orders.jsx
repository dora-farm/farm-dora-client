import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../common/components/Pagination';
import ReviewModal from './modal/ReviewModal';
import PaymentInfo from './modal/PaymentInfo';
import DateFilter from './components/DateFilter';

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
    pageSize: 5 // OrderController에서 조정 
  });

  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    orderId: null,
    orderData: null,
    saleData: null
  });

  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    orderId: null,
    orderData: null
  });

  const openReviewModal = (orderId, orderData, saleData) => {
    setReviewModal({
      isOpen: true,
      orderId,
      orderData,
      saleData
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      orderId: null,
      orderData: null,
      saleData: null
    });
  };

  const openPaymentModal = (orderId, orderData) => {
    setPaymentModal({
      isOpen: true,
      orderId,
      orderData
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      isOpen: false,
      orderId: null,
      orderData: null
    });
  };
  
  // URL에서 쿼리 파라미터 가져오기
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const startDate = params.get('startDate') || getFirstDayOfMonth();
    const endDate = params.get('endDate') || getLastDayOfMonth();
    const page = params.get('page') || 0;
    
    return { startDate, endDate, page: parseInt(page) };
  };

  // 현재 달의 첫날 구하기
  const getFirstDayOfMonth = () => {
    const now = new Date();
    const FristDayofMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return FristDayofMonth.toISOString().split('T')[0];
  };
  
  // 현재 달의 마지막 날 구하기
  const getLastDayOfMonth = () => {
    const now = new Date();
    const LastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return LastDayOfMonth.toISOString().split('T')[0];
  };
  
  // URL 쿼리 파라미터에서 날짜 정보 가져오기
  const queryParams = getQueryParams();
  const [dateRange, setDateRange] = useState({ 
    startDate: queryParams.startDate, 
    endDate: queryParams.endDate 
  });
  
  // 주문 목록 불러오기
  const getOrdersWithAxios = async () => {
    try {
      setLoading(true);
      const { startDate, endDate, page } = getQueryParams();
      
      const response = await axios.get(`http://localhost:8080/api/my/user/order`, {
        params: { startDate, endDate, page }
      });
      
      if (response.data.status === 200) {
        setOrders(response.data.data.contents);
        setPagination({
          currentPage: response.data.data.currentPage,
          totalElements: response.data.data.totalElements,
          totalPages: response.data.data.totalPages,
          hasNext: response.data.data.hasNext,
          hasPrev: response.data.data.hasPrev,
          pageSize: response.data.data.pageSize
        });
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 문제가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 현재 선택된 날짜 범위 타입을 저장하는 상태
  const [selectedRange, setSelectedRange] = useState(''); // 기본값은 '전체'

  // 날짜 범위 선택 핸들러
  const handleDateRangeUpdate = (newDateRange, rangeType) => {
    setDateRange(newDateRange);
    setSelectedRange(rangeType);
    
    // 페이지는 항상 0으로 리셋
    navigate(`/my/user/order?startDate=${newDateRange.startDate}&endDate=${newDateRange.endDate}&page=0`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    navigate(`/my/user/order?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&page=${newPage}`);
  };

   // 주문 상태 매핑
  const getOrderStatusInfo = (statusId) => {
    const statusMap = {
      1: { name: '배송준비', color: 'bg-blue-100 text-blue-800' },
      2: { name: '배송중', color: 'bg-yellow-100 text-yellow-800' },
      3: { name: '배송완료', color: 'bg-green-100 text-green-800' },
      4: { name: '취소', color: 'bg-red-100 text-red-800' },
      5: { name: '반품', color: 'bg-purple-100 text-purple-800' },
      6: { name: '교환', color: 'bg-indigo-100 text-indigo-800' },
    };
    
    return statusMap[statusId] || { name: '알 수 없음', color: 'bg-gray-100 text-gray-800' };
  };
  
  const handleCancelOrder = async (orderId) => {
    if(window.confirm("주문을 취소하시겠습니까?")) {
      try {
        const response = await axios.put(`http://localhost:8080/api/my/user/order/${orderId}/cancel`);
        if(response.status == 200) {
          alert("성공적으로 주문이 취소되었습니다.");
          getOrdersWithAxios();
        }
      } catch (error) {
        console.log("주문취소실패", error);
        alert("주문 취소 실패")
      }
    }
  }

  // 리뷰 완료 처리 함수
  const handleReviewComplete = (orderId, saleId) => {
    // 주문 목록에서 해당 주문 찾기
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        // 해당 주문 내의 특정 상품 찾기
        const updatedSales = order.sales.map(sale => {
          if (sale.saleId === saleId) {
            // 리뷰 완료 상태로 업데이트
            return { ...sale, reviewCompleted: true };
          }
          return sale;
        });
        return { ...order, sales: updatedSales };
      }
      return order;
    });
    
    // 업데이트된 주문 목록으로 상태 갱신
    setOrders(updatedOrders);
  };
  
  // URL 변경 감지하여 데이터 다시 불러오기
  useEffect(() => {
    getOrdersWithAxios();
  }, [location.search]);
  
  // 초기 렌더링 시 URL 설정
  useEffect(() => {
    // URL이 없거나 쿼리 파라미터가 누락된 경우 기본값으로 리다이렉트
    if (!location.search || !getQueryParams().startDate || !getQueryParams().endDate) {
      navigate(`/my/user/order?startDate=${getFirstDayOfMonth()}&endDate=${getLastDayOfMonth()}&page=0`);
      setSelectedRange('all'); // 기본 범위를 '전체'로 설정
    }
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center p-6">{error}</div>
  );

  return (
    <div className="w-full m-7">
      <DateFilter
        dateRange={dateRange}
        selectedRange={selectedRange}
        onRangeUpdate={handleDateRangeUpdate}
      />
      
      {/* 주문 목록 */}
      <div className="space-y-5">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">주문 내역이 없습니다.</div>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="border border-gray-200 rounded overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="font-bold">
                  {new Date(order.createdDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })} 주문
                </div>
                <div className="text-gray-600 text-sm">주문번호: {order.orderId}</div>
                <div className="flex justify-between items-center mt-2">
                  <button 
                    className="px-3 py-1 border border-gray-dark rounded hover:bg-gray-300 transition-colors text-gray-700 text-sm"
                    onClick={() => openPaymentModal(order.orderId, order)}>
                    결제 정보
                  </button>
                  <div className="font-bold">총 결제금액: {order.amount?.toLocaleString()}원</div>
                </div>
              </div>
              
              {/* 상품 목록 */}
              {order.sales && order.sales.map((sale) => (
                <div key={`${order.orderId}-${sale.saleId}`} className="flex items-center p-4 border-b last:border-b-0">
                  <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded">
                    <img 
                      src={`/images/${sale.saveFile}`} 
                      alt={sale.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="text-lg font-medium">{sale.title}</div>
                    <div className="text-gray-600 mt-1">
                      {sale.options && sale.options.map((option, optionIdx) => (
                        <div key={`${sale.saleId}-${optionIdx}`}>{option.name} {option.quantity}개 <span className='text-xs text-gray-dark'>{option.price}원</span></div> 
                      ))}
                    </div>
                  </div>

                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderStatusInfo(sale.statusId).color}`}>
                    {getOrderStatusInfo(sale.statusId).name}
                  </div>
                  
                  <div className="ml-7 flex flex-col items-end space-y-3">
                    <button 
                      className={`px-3 py-1 border rounded text-sm ${
                        sale.reviewCompleted 
                          ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' 
                          : 'border-gray-dark hover:bg-gray-300 transition-colors text-gray-700'
                      }`}
                      onClick={() => !sale.reviewCompleted && openReviewModal(order.orderId, order, sale)}
                      disabled={sale.reviewCompleted}
                    > 
                      {sale.reviewCompleted ? '리뷰 완료' : '리뷰 작성'}
                    </button>

                    {/* 배송준비 */}
                    {sale.statusId === 1 && (
                      <button className="px-3 py-1 bg-danger text-white rounded text-sm hover:bg-danger-dark transition-colors"
                      onClick={() => handleCancelOrder(order.orderId)}>
                        주문 취소
                      </button>
                    )}
                    
                    {/* 배송중, 배송완료 */}
                    {(sale.statusId === 2 || sale.statusId === 3) && (
                      <button className="px-3 py-1 bg-green text-white rounded text-sm hover:bg-green-700 transition-colors">
                        교환/반품
                      </button>
                    )}
                    
                    {/* 취소 */}
                    {sale.statusId === 4 && (
                      <button className="px-3 py-1 bg-danger text-gray-500 rounded text-sm cursor-not-allowed" disabled>
                        주문 취소
                      </button>
                    )}
                    
                    {/* 교환, 반품 */}
                    {(sale.statusId === 5 || sale.statusId === 6) && (
                      <button className="px-3 py-1 bg-gray-300 text-gray-500 rounded text-sm cursor-not-allowed" disabled>
                        교환/반품
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      
      {orders.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={handlePageChange}
          activeColor="bg-green"
          hoverColor="hover:bg-gray"
        />
      )}

      <ReviewModal 
        isOpen={reviewModal.isOpen} 
        onClose={closeReviewModal} 
        orderId={reviewModal.orderId}
        orderData={reviewModal.orderData}
        saleData={reviewModal.saleData}
        onReviewComplete={handleReviewComplete}
      />

      <PaymentInfo
        isOpen={paymentModal.isOpen}
        onClose={closePaymentModal}
        orderId={paymentModal.orderId}
        orderData={paymentModal.orderData}
      />
    </div>
  );
}

export default Orders;