import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import ListForm from './components/ListForm';
import Pagination from '../../../common/components/Pagination';

function Order() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 15,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  const handleSearch = async (params) => {
    try {
      setLoading(true);
      setSearchParams(params);
  
      const response = await axios.get(
        `http://localhost:8030/my/seller/order/search`,
        { params }
      );
  
      if (response.status === 200) {
        const responseData = response.data.data;
  
        // 가공 없이 그대로 전달
        setOrders(responseData.contents || []);
  
        setPagination({
          currentPage: responseData.currentPage,
          pageSize: responseData.pageSize,
          totalElements: responseData.totalElements,
          totalPages: responseData.totalPages,
          hasNext: responseData.hasNext,
          hasPrev: responseData.hasPrevious,
        });
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
  
  useEffect(() => {
    handleSearch();
  }, []);
  
  return (
    <div className="space-y-6">
      <Container className="">
        <SearchForm 
          onSearch={handleSearch}
          initialValues={searchParams}
        />
      </Container>
      
      <Container>
        <ListForm 
          orders={orders}
          loading={loading}
          error={error}
        />
      </Container>
      <Pagination 
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNext={pagination.hasNext}
        hasPrev={pagination.hasPrev}
        pageButtonCount={5}
        activeColor="bg-brown"
        hoverColor="hover:bg-gray-100"
      />
    </div>
  );
}

export default Order;