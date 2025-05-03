import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from '../../../common/utils/axiosInstance';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import OrderList from './components/OrderList';
import Pagination from '../../../common/components/Pagination';
import OrderDetailModal from './components/OrderDetailModal';

function Order() {
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  // 모달 상태 추가
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleSearch = async (params) => {
    try {
      setLoading(true);
      
      // 검색 파라미터에 페이지 정보 추가
      const searchParams = {
        ...params,
        page: 0,           // 검색 시 첫 페이지부터 시작
        size: itemsPerPage  // 페이지 크기
      };
      
      setSearchParams(searchParams);
      setCurrentPage(0);    // 검색 시 첫 페이지로 초기화

      const response = await axios.get(
        `${import.meta.env.VITE_SEARCH_REST_API_URL}/my/seller/order/search`,
        { 
          params: searchParams
        }
      );
  
      if (response.status === 200) {
        const responseData = response.data.data;
        
        // 응답에서 주문 데이터와 페이지네이션 정보 추출
        setOrders(responseData.contents || []);
        
        // 백엔드에서 받은 페이지네이션 정보 저장
        setCurrentPage(responseData.currentPage || 0);
        setTotalPages(responseData.totalPages || 1);
        setTotalElements(responseData.totalElements || 0);
        setHasPrev(responseData.hasPrevious || false);
        setHasNext(responseData.hasNext || false);
        
      } else {
        throw new Error(response.data?.message || '주문 정보를 가져오는데 실패했습니다.');
      }
  
    } catch (error) {
      console.error("주문 목록을 호출할 수 없습니다.", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const startDate = `${oneMonthAgo.toLocaleDateString('en-CA')}T00:00:00`;
  const endDate = `${today.toLocaleDateString('en-CA')}T23:59:59`;

  const initialParams = useMemo(() => ({
    searchType: "PRODUCT",
    startDate: startDate,
    endDate: endDate,
    statusIds: [],
    searchPeriod: "ONE_MONTH",
    sort: "LATEST",
    keyword: "",
    page: 0,          // 페이지 번호 추가
    size: itemsPerPage, // 페이지 크기 설정
  }), [startDate, endDate, itemsPerPage]);




  const loadOrderDetail = async (orderId) => {
    if (!orderId) return;
    try {
      setDetailLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SEARCH_REST_API_URL}/api/my/seller/order/detail`, 
        { params: { orderId } }
      );

      if (response.status === 200) {
        setOrderDetail(response.data.data);
        setModalOpen(true);
      } else {
        throw new Error(response.data?.message || '주문 상세 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.log("주문 상세정보를 불러올 수 없습니다.", error.message);
      setError(error.message);
    } finally {
      setDetailLoading(false);
    }
  };
  
  useEffect(() => {
    setSearchParams(initialParams);
    handleSearch(initialParams);
  }, []);
  
  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    
    // 페이지 변경 시 API 재호출
    const pageParams = {
      ...searchParams,
      page: newPage,
      size: itemsPerPage
    };
    
    // 페이지 데이터 요청
    (async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `${import.meta.env.VITE_SEARCH_REST_API_URL}/my/seller/order/search`,
          { 
            params: pageParams,
          }
        );
        
        if (response.status === 200) {
          const responseData = response.data.data;
          
          // 응답에서 주문 데이터와 페이지네이션 정보 업데이트
          setOrders(responseData.contents || []);
          setTotalPages(responseData.totalPages || 1);
          setTotalElements(responseData.totalElements || 0);
          setHasPrev(responseData.hasPrevious || false);
          setHasNext(responseData.hasNext || false);
        } else {
          throw new Error(response.data?.message || '주문 정보를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error("페이지 데이터를 가져올 수 없습니다.", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, itemsPerPage]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    loadOrderDetail(order.orderId);
  }
  
  return (
    <div className="space-y-6">
      <Container>
        <SearchForm 
          onSearch={handleSearch}
          initialValues={searchParams}
          showStatusFilter={true}
          showSortedFilter={true}
        />
      </Container>
      <Container>        
        <OrderList 
          orders={orders}
          loading={loading}
          error={error}
          onOrderClick={handleOrderClick}
        />
      </Container>
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          pageButtonCount={5}
          onPageChange={handlePageChange}
          activeColor="bg-brown"
          hoverColor="hover:bg-gray-100"
        />
      )}

      <OrderDetailModal
        detail={orderDetail}
        order={selectedOrder}
        loading={detailLoading}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setOrderDetail(null);
        }}
      />
    </div>
  );
}

export default Order;