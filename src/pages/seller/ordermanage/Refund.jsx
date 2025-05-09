import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from '../../../common/utils/axiosInstance';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import OrderList from './components/OrderList';
import Pagination from '../../../common/components/Pagination';
import OrderDetailModal from './components/OrderDetailModal';

function Refund() {
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refundOrders, setRefundOrders] = useState([]);
  const [searchParams, setSearchParams] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [refundDetail, setRefundDetail] = useState(null);

  const handleSearch = async (params) => {
    try {
      setLoading(true);

      const modifiedParams = {
        ...params,
        statusIds: 5,
        page: 0,
        size: itemsPerPage
      };

      setSearchParams(modifiedParams); 
      setCurrentPage(0);

      const response = await axios.get(
        `${import.meta.env.VITE_SEARCH_REST_API_URL}/my/seller/order`,
        { params: modifiedParams }
      );

      if (response.status === 200) {
        const responseData = response.data.data;
        setRefundOrders(responseData.contents || []);

        setCurrentPage(responseData.currentPage || 0);
        setTotalPages(responseData.totalPages || 1);
        setTotalElements(responseData.totalElements || 0);
        setHasPrev(responseData.hasPrevious || false);
        setHasNext(responseData.hasNext || false);

      } else {
        throw new Error(response.data?.message || '주문 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error("신규 주문 목록을 호출할 수 없습니다.", error.message);
      setError(error.message);
    } finally {
      setLoading(false)
    }
  }
  const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
  
    const startDate = `${oneMonthAgo.toLocaleDateString('en-CA')}T00:00:00`;
    const endDate = `${today.toLocaleDateString('en-CA')}T23:59:59`;
  
    const initialParams = useMemo(() => ({
      searchType: "PRODUCT",
      startDate: startDate,
      endDate: endDate,
      statusIds: 5,
      searchPeriod: "ONE_MONTH",
      sort: "LATEST",
      keyword: "",
      page: 0,
      size: itemsPerPage,
    }), [startDate, endDate, itemsPerPage]);

    const loadOrderDetail = async (orderId) => {
      if (!orderId) return;

      try {
        setDetailLoading(true);
        const orderResponse = await axios.get(
          `${import.meta.env.VITE_ACTIVITY_REST_API_URL}/my/seller/order/detail`, 
          { params: { orderId } }
        );

        const refundResponse = await axios.get(
          `${import.meta.env.VITE_ACTIVITY_REST_API_URL}/my/seller/order/refund`,
          { params: { orderId } }
        );
  
        if (orderResponse.status === 200) {
          setOrderDetail(orderResponse.data.data);
          
          if (refundResponse.status === 200 && refundResponse.data.data.length > 0) {
            // 환불 기본 정보는 첫 번째 항목에서 가져옴
            const refundInfo = refundResponse.data.data[0];
            
            // 파일 정보는 배열에서 추출
            const fileList = refundResponse.data.data
              .filter(item => item.saveFile !== null)
              .map(item => item.saveFile);
            
            // 환불 정보 객체 생성
            const refundData = {
              createdDate: refundInfo.createdDate,
              typeName: refundInfo.typeName,
              content: refundInfo.content,
              files: fileList
            };
            
            setRefundDetail(refundData);
          } else {
            setRefundDetail(null);
          }
          setModalOpen(true);
        } else {
          throw new Error(orderResponse.data?.message || '주문 정보를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.log("주문 상세정보를 불러올 수 없습니다.", error.message);
        setError(error.message);
      } finally {
        setDetailLoading(false);
      }
    };
    
    useEffect(() => {
      setSearchParams(initialParams); // ← 초기값 저장
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
          `${import.meta.env.VITE_SEARCH_REST_API_URL}/my/seller/order`,
          { params: pageParams }
        );
        
        if (response.status === 200) {
          const responseData = response.data.data;
          
          // 응답에서 주문 데이터와 페이지네이션 정보 업데이트
          setRefundOrders(responseData.contents || []);
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

  const handleOrderClick = (newOrder) => {
    setSelectedOrder(newOrder);
    loadOrderDetail(newOrder.orderId);
  }
  
  return (
    <div className="space-y-6">
      <Container>
        <SearchForm 
          onSearch={handleSearch}
          initialValues={searchParams}
          showStatusFilter={false}
          showSortedFilter={true}
        />
      </Container>
      
      <Container>        
        <OrderList 
          orders={refundOrders}
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
        refund={refundDetail}
        loading={detailLoading}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setOrderDetail(null);
          setRefundDetail(null);
        }}
      />
    </div>
  )
}

export default Refund;