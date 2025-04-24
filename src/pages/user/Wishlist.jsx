import React, { useState } from "react";
import { useWishlist } from "./hooks/useWishlist";
import WishlistItem from "./components/WishlistItem";
import GreenCircleCheckbox from "../../common/components/GreenCircleCheckbox";
import Pagination from "../../common/components/Pagination";
import AlertModal from "../../common/components/modal/AlertModal";

function Wishlist() {
  const userId = 1;
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // 모달 상태 관리
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    message: "",
    callback: null
  });

  const {
    wishlistItems, 
    isLoading, 
    imageErrors, 
    totalItems, 
    totalPages, 
    currentPage, 
    hasPrev, 
    hasNext, 
    formatImageUrl, 
    handleImageError,
    toggleItemSelection,
    toggleSelectAll,
    selectedItems,
    isAllSelected,
    onPageChange,
    deleteSelectedItems,
    deleteSingleItem,
    selectedItemsToDelete
  } = useWishlist(userId, false);

  // 알림 모달 열기
  const showAlert = (message, callback = null) => {
    setAlertModal({
      isOpen: true,
      message,
      callback
    });
  };

  // 모달 닫기
  const closeModal = () => {
    const { callback } = alertModal;
    setAlertModal({ isOpen: false, message: "", callback: null });
    
    // 콜백이 있으면 실행
    if (callback) {
      callback();
    }
  };

  // 삭제 버튼 클릭 핸들러 - 바로 삭제 실행
  const handleDeleteClick = async () => {
    if (selectedItemsToDelete.length === 0) {
      showAlert("삭제할 상품을 선택해주세요.");
      return;
    }
    
    // 바로 삭제 실행
    setDeleteLoading(true);
    
    try {
      const success = await deleteSelectedItems();
      
      if (success) {
        showAlert("선택한 상품이 삭제되었습니다.");
      } else {
        showAlert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      showAlert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">찜 리스트</h1>
        <div className="flex flex-col items-center justify-center h-64 border border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">찜한 상품이 없습니다.</p>
          <button 
            onClick={() => window.location.href = '/products'}
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
      <h1 className="text-2xl font-bold text-center mb-8">찜 리스트</h1>

      <div className="border-y-2 border-gray-dark py-4 mb-4">
        <div className="flex items-center ml-4 justify-between">
          <div className="flex items-center ml-14">
            <GreenCircleCheckbox checked={isAllSelected} onChange={toggleSelectAll}/>
            <span className="font-medium">전체 선택</span>
            <span className="text-sm ml-2 text-gray-600">
              (총 {totalItems}개)
            </span>
          </div>
          <button 
            className={`px-3 py-1 ${selectedItemsToDelete.length === 0 ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white text-sm rounded mr-10 transition-colors`}
            onClick={handleDeleteClick}
            disabled={selectedItemsToDelete.length === 0 || deleteLoading}
          >
            {deleteLoading ? '삭제 중...' : '선택 삭제'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0">
        {wishlistItems.map((item) => (
          <WishlistItem
            key={item.saleId}
            item={item}
            formatImageUrl={formatImageUrl}
            onImageError={handleImageError}
            imageError={imageErrors[item.likeId]}
            checked={selectedItems[item.likeId] || false}
            onToggleSelect={() => toggleItemSelection(item.likeId)}
            onToggleLike={deleteSingleItem}
            showAlert={showAlert}
            previewMode={false}
          />
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasPrev={hasPrev}
          hasNext={hasNext}
          pageButtonCount={5}
          activeColor="bg-green"
          hoverColor="hover:bg-gray-100"
        />
      </div>
      
      {/* 알림 모달 */}
      {alertModal.isOpen && (
        <AlertModal
          message={alertModal.message}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Wishlist;