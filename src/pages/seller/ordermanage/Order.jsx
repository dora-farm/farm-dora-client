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
  
        setOrders(responseData.contents || []);
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
    // 초기 검색 조건 설정
    const initialParams = {
      searchType: "PRODUCT",
      startDate: null,
      endDate: null,
      statusIds: [],
      searchPeriod: "ONE_MONTH",
      sort: "LATEST",
      keyword: "",
      page: 1
    };
    
    handleSearch(initialParams);
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
      {/* <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrev={hasPrev}
        pageButtonCount={10}
        onPageChange={handlePageChange}
        activeColor="bg-brown"
        hoverColor="hover:bg-gray-100"
      /> */}
    </div>
  );
}

export default Order;