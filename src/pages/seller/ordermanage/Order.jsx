import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import ListForm from './components/ListForm';
import Pagination from '../../../common/components/Pagination';

function Order() {
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const handleSearch = async (params) => {
    try {
      setLoading(true);
      setSearchParams(params);
      setCurrentPage(0);
  
      const response = await axios.get(
        `http://localhost:8030/my/seller/order/search`,
        { params }
      );
  
      if (response.status === 200) {
        const responseData = response.data.data;
        setAllOrders(responseData.contents || []);
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
    size: 10000,
  }), [startDate, endDate]);
  
  useEffect(() => {
    setSearchParams(initialParams); // ← 초기값 저장
    handleSearch(initialParams);
  }, []);

  // 페이지네이션 계산
  const totalElements = allOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / itemsPerPage));
  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;
  
  // 현재 페이지에 해당하는 주문만 필터링
  const currentOrders = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allOrders.slice(startIndex, endIndex);
  }, [allOrders, currentPage, itemsPerPage]);
  
  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);
  
  return (
    <div className="space-y-6">
      <Container>
        <SearchForm 
          onSearch={handleSearch}
          initialValues={searchParams}
          showStatusFilter={true}
        />
      </Container>
      <Container>        
        <ListForm 
          orders={currentOrders}
          loading={loading}
          error={error}
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
    </div>
  );
}

export default Order;