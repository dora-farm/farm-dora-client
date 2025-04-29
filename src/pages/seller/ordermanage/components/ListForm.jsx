import React from 'react';

const ListForm = ({ orders = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">데이터를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">주문 내역이 없습니다.</div>
      </div>
    );
  }
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "-";
    return price.toLocaleString() + '원';
  };

  // 상품명과 옵션을 포맷팅하는 함수
  const formatProductTitle = (order) => {
    if (!order.products) return "-";
    
    // products가 배열인 경우
    if (Array.isArray(order.products)) {
      if (order.products.length === 0) return "-";
      if (order.products.length === 1) return order.products[0].saleTitle || "-";
      return `${order.products[0].saleTitle} 외 ${order.products.length - 1}건`;
    }
    
    // products가 객체인 경우 (이미 변환된 데이터)
    return order.products.saleTitle || "-";
  };

  // 옵션 정보를 포맷팅하는 함수
  const formatOptions = (order) => {
  if (Array.isArray(order.products) && order.products.length > 0) {
    const firstProduct = order.products[0];
    if (Array.isArray(firstProduct.options) && firstProduct.options.length > 0) {
      const firstOption = firstProduct.options[0].name || "-";
      const optionCount = firstProduct.options.length;
      return optionCount > 1
        ? `${firstOption} 외 ${optionCount - 1}건`
        : firstOption;
    }
  }
  return "-";
};

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-b border-gray-300 select-none">
        <thead className="bg-brown text-white">
          <tr>
            <th className="border px-4 py-2 min-w-[80px] text-center">주문번호</th>
            <th className="border px-4 py-2 min-w-[280px] text-center">상품명</th>
            <th className="border px-4 py-2 min-w-[100px] text-center">주문일시</th>
            <th className="border px-4 py-2 min-w-[100px] text-center">주문자</th>
            <th className="border px-4 py-2 min-w-[100px] text-center">주문금액</th>
            <th className="border px-4 py-2 min-w-[98px] text-center">주문상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr 
              key={order.orderId} 
              className="hover:bg-gray-100 transition-colors cursor-default"
            >
              <td className="border-b border-gray-300 px-5 py-4 text-center text-sm font-medium">
                {order.orderId || "-"}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
                {formatProductTitle(order)}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
                {formatDate(order.createdDate)}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm">
                {order.buyerName || "-"}
              </td>
              <td className="border-b border-gray-300 px-4 py-4 text-center text-sm font-medium">
                {formatPrice(order.totalPrice)}
              </td>
              <td className={"border-b border-gray-300 px-4 py-4 text-center text-sm font-medium"}>
                {order.orderStatus || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListForm;