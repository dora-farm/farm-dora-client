import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../common/components/Pagination';

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
  const fetchOrders = async () => {
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
  const [selectedRange, setSelectedRange] = useState('all'); // 기본값은 '전체'

  // 날짜 범위 선택 핸들러
  const handleDateRangeSelect = (range) => {
    const today = new Date();
    let startDate, endDate;
    
    // 현재 선택된 범위 업데이트
    setSelectedRange(range);
    
    switch(range) {
      case 'all':
        // 전체: 오늘부터 2년 이내
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 2);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        // 1주일: 오늘부터 7일 전
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'month':
        // 1개월: 오늘부터 30일 전
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'quarter':
        // 3개월: 오늘부터 90일 전
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        startDate = startDate.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      default:
        return;
    }
    
    setDateRange({ startDate, endDate });
    
    // 페이지는 항상 0으로 리셋
    navigate(`/my/user/order?startDate=${startDate}&endDate=${endDate}&page=0`);
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
  
  // 검색 버튼 핸들러
  const handleSearch = () => {
    // 검색 시 페이지는 항상 0으로 리셋
    navigate(`/my/user/order?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&page=0`);
  };
  
  // URL 변경 감지하여 데이터 다시 불러오기
  useEffect(() => {
    fetchOrders();
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
      {/* 필터 섹션 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button 
          onClick={() => handleDateRangeSelect('all')} 
          className={`px-3 py-1 border border-gray-300 rounded text-sm ${
            selectedRange === 'all' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
          }`}
        >
          전체
        </button>
        <button 
          onClick={() => handleDateRangeSelect('week')} 
          className={`px-3 py-1 border border-gray-300 rounded text-sm ${
            selectedRange === 'week' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
          }`}
        >
          1주일
        </button>
        <button 
          onClick={() => handleDateRangeSelect('month')} 
          className={`px-3 py-1 border border-gray-300 rounded text-sm ${
            selectedRange === 'month' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
          }`}
        >
          1개월
        </button>
        <button 
          onClick={() => handleDateRangeSelect('quarter')} 
          className={`px-3 py-1 border border-gray-300 rounded text-sm ${
            selectedRange === 'quarter' ? 'bg-green text-white' : 'bg-white text-gray-700 hover:bg-green-700 transition-colors hover:text-white'
          }`}
        >
          3개월
        </button>
        
        <input 
          type="date" 
          name="startDate"
          value={dateRange.startDate}
          onChange={(e) => {
            setDateRange(prev => ({ ...prev, startDate: e.target.value }));
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
        />
        <span>~</span>
        <input 
          type="date" 
          name="endDate"
          value={dateRange.endDate}
          onChange={(e) => {
            setDateRange(prev => ({ ...prev, endDate: e.target.value }));
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm cursor-pointer"
        />
        
        <button 
          onClick={handleSearch}
          className="px-4 py-1 bg-green text-white rounded text-sm ml-2 hover:bg-green-700 transition-colors"
        >
          조회
        </button>
      </div>
      
      {/* 주문 목록 */}
      <div className="space-y-5">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">주문 내역이 없습니다.</div>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="border border-gray-200 rounded overflow-hidden">
              <div className="flex items-center p-4">
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded">
                  <img 
                    src={`/images/${order.saveFile}`} 
                    alt={order.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="font-bold text-lg">
                    {new Date(order.createdDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </div>
                  <div className="text-lg mt-1">{order.title}</div>
                  <div className="text-gray-600 mt-1">
                    {order.options.map((option, idx) => (
                      <div key={idx}>{option.name} {option.quantity}개</div>
                    ))}
                  </div>
                  <div className="font-bold mt-1">{order.amount.toLocaleString()}원</div>
                </div>

                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getOrderStatusInfo(order.statusId).color}`}>
                  {getOrderStatusInfo(order.statusId).name}
                </div>
                
                <div className="ml-7 flex flex-col items-end space-y-3">
                  <button className="px-3 py-1 border border-gray-dark rounded hover:bg-gray-300 transition-colors text-gray-700 text-sm">
                    리뷰 작성
                  </button>
                  <button className="px-3 py-1 border border-gray-dark rounded hover:bg-gray-300 transition-colors text-gray-700 text-sm">
                    결제 정보
                  </button>
                  {/* 배송준비 */}
                  {order.statusId === 1 && (
                    <button className="px-3 py-1 bg-danger text-white rounded text-sm hover:bg-danger-dark transition-colors">
                      주문 취소
                    </button>
                  )}
                  
                  {/* 배송중, 배송완료 */}
                  {(order.statusId === 2 || order.statusId === 3) && (
                    <button className="px-3 py-1 bg-green text-white rounded text-sm hover:bg-green-700 transition-colors">
                      교환/반품
                    </button>
                  )}
                  
                  {/* 취소 */}
                  {order.statusId === 4 && (
                    <button className="px-3 py-1 bg-danger text-gray-500 rounded text-sm cursor-not-allowed" disabled>
                      주문 취소
                    </button>
                  )}
                  
                  {/* 교환, 반품 */}
                  {(order.statusId === 5 || order.statusId === 6) && (
                    <button className="px-3 py-1 bg-gray-300 text-gray-500 rounded text-sm cursor-not-allowed" disabled>
                      교환/반품
                    </button>
                  )}
                </div>
              </div>
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
    </div>
  );
}

export default Orders;