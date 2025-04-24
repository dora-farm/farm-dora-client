import React, { useState, useCallback } from "react";
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
    setCurrentPage,
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

  // 알림 모달 열기 - useCallback으로 메모이제이션하여 안정성 높임
  const showAlert = useCallback((message, callback = null) => {
    console.log("showAlert 함수 호출됨:", message);
    // setTimeout을 사용하여 상태 업데이트를 다음 틱으로 지연
    setTimeout(() => {
      setAlertModal({
        isOpen: true,
        message,
        callback
      });
    }, 0);
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
    const { callback } = alertModal;
    setAlertModal(prev => ({ ...prev, isOpen: false }));
    
    // 콜백이 있으면 실행, 약간의 지연 후 실행
    if (callback) {
      setTimeout(() => {
        callback();
      }, 50);
    }
    
    // 완전히 초기화는 트랜지션 이후에
    setTimeout(() => {
      setAlertModal({ isOpen: false, message: "", callback: null });
    }, 300);
  }, [alertModal]);

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = async () => {
    if (selectedItemsToDelete.length === 0) {
      showAlert("삭제할 상품을 선택해주세요.");
      return;
    }
  
    setDeleteLoading(true);
  
    try {
      // 현재 페이지 정보 및 선택된 항목 수 미리 계산
      const currentPageItems = wishlistItems.slice(
        currentPage * 5,
        (currentPage + 1) * 5
      );
      const selectedCount = currentPageItems.filter(
        (item) => selectedItems[item.likeId]
      ).length;
      const willBeEmptyPage =
        selectedCount === currentPageItems.length && currentPage > 0;
      
      // 삭제 작업 실행
      const success = await deleteSelectedItems();
  
      if (success) {
        // 삭제 성공 후 모달 표시
        if (willBeEmptyPage) {
          showAlert("찜 항목이 삭제되었습니다!", () => {
            setCurrentPage((prev) => Math.max(0, prev - 1));
          });
        } else {
          showAlert("찜 항목이 삭제되었습니다!");
        }
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
      
      {/* 알림 모달 - 상태 관리 강화 */}
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