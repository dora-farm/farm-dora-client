import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchWithAuth } from "../../common/utils/fetchWithAuth";

function OrderPage() {
  const location = useLocation();
  const items = location.state?.items || [];

  useEffect(() => {
    console.log("주문 페이지에 전달된 장바구니 항목:", items);
  }, [items]);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetchWithAuth(
          `${import.meta.env.VITE_AUTH_REST_API_URL}/api/mypage/user/depot/all`,
          { method: "GET" }
        );
        const result = await response.json();
        const addressList = result.data;
        setAddresses(addressList);
        const defaultAddr = addressList.find((addr) => addr.defaultAddr) || addressList[0];
        setSelectedAddress(defaultAddr);
      } catch (err) {
        console.error("배송지 불러오기 실패", err);
      }
    };

    fetchAddresses();
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!selectedAddress || !selectedAddress.depotId) {
      alert("배송지를 선택해주세요.");
      return;
    }

    try {
      let response;

      if (location.state?.orderType === 'direct') {
        response = await fetchWithAuth(
          `${import.meta.env.VITE_BUYER_REST_API_URL}/api/order/direct`,
          {
            method: "POST",
            body: JSON.stringify({
              optionId: location.state.optionId,
              quantity: location.state.quantity,
              depotId: selectedAddress.depotId,
            }),
          },
        );
      } else {
        const basketIds = items.map((item) => item.basketId);
        response = await fetchWithAuth(
          `${import.meta.env.VITE_BUYER_REST_API_URL}/api/order/basket`,
          {
            method: "POST",
            body: JSON.stringify({
              basketIds,
              depotId: selectedAddress.depotId,
            }),
          },
        );
      }

      const result = await response.json();
      if (response.ok) {
        alert("주문이 완료되었습니다.");
      } else {
        alert("주문 실패: " + result.message);
      }
    } catch (error) {
      console.error("주문 요청 실패:", error);
      alert("주문 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">주문 결제</h1>

      {/* 배송지 정보 */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">배송지 정보</h2>
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setShowAddressList(!showAddressList)}
          >
            변경
          </button>
        </div>

        {selectedAddress ? (
          <div className="text-sm text-gray-700">
            <p className="font-medium">
              {selectedAddress.receiverName} ({selectedAddress.phoneNum})
            </p>
            <p>
              {selectedAddress.address.addr} {selectedAddress.address.detailAddr}
              <span className="text-xs text-gray-400"> ({selectedAddress.address.postNum})</span>
            </p>
            {selectedAddress.require && (
              <p className="text-xs text-gray-500">요청사항: {selectedAddress.require}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-400">배송지를 선택하세요.</p>
        )}

        {showAddressList && (
          <div className="mt-4 border-t pt-4 space-y-2">
            {addresses.map((addr) => (
              <div
                key={addr.depotId}
                className={`p-3 rounded cursor-pointer border ${
                  selectedAddress?.depotId === addr.depotId
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedAddress(addr);
                  setShowAddressList(false);
                }}
              >
                <p className="font-medium">
                  {addr.receiverName} ({addr.phoneNum})
                </p>
                <p className="text-sm text-gray-600">
                  {addr.address.addr} {addr.address.detailAddr} ({addr.address.postNum})
                </p>
                {addr.require && (
                  <p className="text-xs text-gray-500">요청사항: {addr.require}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 주문 상품 리스트 */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">주문 상품</h2>
        {items.map((item) => (
          <div
            key={item.basketId}
            className="flex items-center gap-4 border-b pb-4 mb-4"
          >
            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-gray-400">이미지 없음</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">옵션: {item.option}</p>
              <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
            </div>
            <div className="text-right font-semibold text-gray-800 min-w-[80px]">
              {(item.price * item.quantity).toLocaleString()}원
            </div>
          </div>
        ))}
      </div>

      {/* 결제 정보 */}
      <div className="bg-gray-50 border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
        <div className="flex justify-between text-lg font-bold text-red-600 border-t pt-4">
          <span>총 결제 금액</span>
          <span>{totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <div className="text-center mt-8">
        <button
          onClick={handleOrder}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

export default OrderPage;