import React from "react";
import { useWishlist } from "./hooks/useWishlist";
import WishlistItem from "./components/WishlistItem";
import GreenCircleCheckbox from "../../common/components/GreenCircleCheckbox";
import Pagination from "../../common/components/Pagination";

function Wishlist() {
  const userId = 1;

  const {
    wishlistItems,
    isLoading,
    imageErrors,
    selectedItems,
    isAllSelected,
    formatImageUrl,
    handleImageError,
    toggleItemSelection,
    toggleSelectAll,
    deleteSelectedItems,
    addToCart
  } = useWishlist(userId, false);

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
            <GreenCircleCheckbox checked={isAllSelected} onChange={toggleSelectAll} />
            <span className="font-medium">전체 선택</span>
            <span className="text-sm ml-2 text-gray-600">
              (총 {wishlistItems.length}개)
            </span>
          </div>
          <button 
            className="px-3 py-1 bg-red-500 text-white text-sm rounded mr-10"
            onClick={deleteSelectedItems}
            disabled={!Object.values(selectedItems).some(selected => selected)}
          >
            선택 삭제
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0">
        {wishlistItems.map((item) => (
          <WishlistItem
            key={item.id}
            item={item}
            selected={selectedItems[item.id]}
            onToggleSelect={toggleItemSelection}
            onAddToCart={addToCart}
            formatImageUrl={formatImageUrl}
            onImageError={handleImageError}
            imageError={imageErrors[item.id]}
            previewMode={false}
          />
        ))}
          <Pagination
            currentPage={0}
            totalPages={Math.ceil(wishlistItems.length / 5)}
            onPageChange={() => {}}
            hasPrev={true}
            hasNext={true}
            pageButtonCount={5}
            activeColor="bg-green"
            hoverColor="hover:bg-gray-100"
          />
      </div>
    </div>
  );
}

export default Wishlist;