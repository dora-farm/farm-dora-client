import React from 'react';

const OrderList = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-300 select-none">
        <thead className="bg-brown text-white">
          <tr>
            <th className="border px-4 py-2 min-w-[80px] text-center">주문번호</th>
            <th className="border px-4 py-2 min-w-[200px] text-center">상품명</th>
            <th className="border px-4 py-2 min-w-[120px] text-center">옵션 목록</th>
            <th className="border px-4 py-2 min-w-[100px] text-center">주문일시</th>
            <th className="border px-4 py-2 min-w-[80px] text-center">주문자</th>
            <th className="border px-4 py-2 min-w-[100px] text-center">주문금액</th>
            <th className="border px-4 py-2 min-w-[98px] text-center">주문상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-100 transition-colors cursor-pointer">
              <td className="border border-gray-300 px-5 py-4 text-center text-sm font-medium">{order.orderId}</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-sm">{order.productName}</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-sm">{order.optionName}</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-sm">{order.orderDate}</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-sm">{order.userName}</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-sm">{order.price.toLocaleString()}원</td>
              <td className="border border-gray-300 px-4 py-4 text-center text-sm">{order.statusName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;