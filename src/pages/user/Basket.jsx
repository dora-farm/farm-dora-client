import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "./hooks/useBasket";
import BasketItem from "./BasketItem";
import GreenCircleCheckbox from "../../common/components/GreenCircleCheckbox";
import Pagination from "../../common/components/Pagination";
import AlertModal from "../../common/components/modal/AlertModal";

function Basket() {
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
    callback: null,
  });

  const {
    basketItems,
    isLoading,
    selectedItems,
    selectedItemsToDelete,
    isAllSelected,
    totalPages,
    currentPage,
    hasPrev,
    hasNext,
    toggleItemSelection,
    toggleSelectAll,
    setCurrentPage,
    deleteSelectedItems,
    deleteSingleItem,
    updateQuantity,
  } = useBasket();

  const showAlert = useCallback((message, callback = null) => {
    setTimeout(() => {
      setAlertModal({ isOpen: true, message, callback });
    }, 0);
  }, []);

  const closeModal = useCallback(() => {
    const { callback } = alertModal;
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
    if (callback) setTimeout(callback, 50);
    setTimeout(() => setAlertModal({ isOpen: false, message: "", callback: null }), 300);
  }, [alertModal]);

  const handleDeleteClick = async () => {
    if (selectedItemsToDelete.length === 0) {
      showAlert("삭제할 상품을 선택해주세요.");
      return;
    }

    setDeleteLoading(true);
    try {
      const success = await deleteSelectedItems();
      if (success) {
        showAlert("장바구니 항목이 삭제되었습니다!", () => {
          setCurrentPage((prev) => Math.max(0, prev - 1));
        });
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      showAlert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOrderClick = () => {
    if (selectedItemsToDelete.length === 0) {
      showAlert("주문할 상품을 선택해주세요.");
      return;
    }

    const selectedBaskets = basketItems.filter(item => selectedItems?.[item.basketId]);
    navigate("/order", { state: { items: selectedBaskets } });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  if (basketItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">장바구니</h1>
        <div className="flex flex-col items-center justify-center h-64 border border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">장바구니에 담긴 상품이 없습니다.</p>
          <button
            onClick={() => (window.location.href = "/products")}
            className="px-4 py-2 bg-brown text-white rounded-md hover:bg-brown-dark transition-colors"
          >
            상품 둘러보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 select-none cursor-default">
      <h1 className="text-2xl font-bold text-center mb-8">장바구니</h1>

      <div className="border-y-2 border-gray-dark py-4 mb-4">
        <div className="flex items-center ml-4 justify-between">
          <div className="flex items-center ml-14">
            <GreenCircleCheckbox checked={isAllSelected} onChange={toggleSelectAll} />
            <span className="font-medium">전체 선택</span>
            <span className="text-sm ml-2 text-gray-600">(총 {basketItems.length}개)</span>
          </div>
          <div className="flex gap-2 mr-10">
            <button
              className={`px-3 py-1 ${selectedItemsToDelete?.length === 0 ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} text-white text-sm rounded transition-colors`}
              onClick={handleDeleteClick}
              disabled={selectedItemsToDelete?.length === 0 || deleteLoading}
            >
              {deleteLoading ? "삭제 중..." : "선택 삭제"}
            </button>
            <button
              className={`px-3 py-1 ${selectedItemsToDelete?.length === 0 ? "bg-gray-400" : "bg-green hover:bg-green-dark"} text-white text-sm rounded transition-colors`}
              onClick={handleOrderClick}
              disabled={selectedItemsToDelete?.length === 0}
            >
              주문하기
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0">
        {basketItems.map((item) => (
          <BasketItem
            key={item.basketId}
            item={item}
            checked={selectedItems?.[item.basketId] || false}
            onToggleSelect={() => toggleItemSelection(item.basketId)}
            onDelete={() => {
              deleteSingleItem(item.basketId);
              showAlert("장바구니 항목이 삭제되었습니다!");
            }}
            onUpdateQuantity={updateQuantity}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        hasPrev={hasPrev}
        hasNext={hasNext}
        pageButtonCount={5}
        activeColor="bg-green"
        hoverColor="hover:bg-gray-100"
      />

      {alertModal.isOpen && <AlertModal message={alertModal.message} onClose={closeModal} />}
    </div>
  );
}

export default Basket;