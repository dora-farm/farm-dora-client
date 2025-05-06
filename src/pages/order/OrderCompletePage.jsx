import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalPrice = location.state?.totalPrice ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-6">주문이 완료되었습니다 🎉</h1>
      <p className="text-gray-700 mb-8">
        주문해주셔서 감사합니다. <br />
        주문 처리 후 마이페이지에서 배송 상황을 확인하실 수 있습니다.
      </p>

      {/* 결제 정보 */}
      <div className="bg-gray-50 border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>상품 금액 합계</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>배송비</span>
            <span>0원</span>
          </div>
        </div>
        <div className="flex justify-between text-lg font-bold text-red-600 border-t pt-4 mt-4">
          <span>총 결제 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
        >
          홈으로 가기
        </button>
        <button
          onClick={() => navigate("/my/user")}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold"
        >
          마이페이지
        </button>
      </div>
    </div>
  );
};

export default OrderCompletePage;