import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '../dashboard/components/ChartContainer';
import SearchForm from './components/SearchForm';
import ListForm from './components/ListForm';

function Order({ sellerId }) {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrderList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8030/my/seller/order/search`
      );
      if (response.status === 200) {
        setOrderList(response.data.data.all)
      } else {
        throw new Error("주문 목록 로딩 실패");
      }
    } catch (error) {
      console.error("주문 목록을 불러올 수 없습니다", error.message)
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderList();
  }, []);

  return (
    <div>
      <Container>
        <SearchForm />
      </Container>

      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Container>
          <ListForm orders={orderList} />
        </Container>
      )}
    </div>
  );
}

export default Order;